"""
AI Integration Service
Extracted from old backend.py - Groq API integration for recommendations
"""

import time
from typing import Optional, Dict
from groq import Groq

from ..models import SoilData
from ..config import settings, get_groq_api_key


# Global client instance
_groq_client: Optional[Groq] = None


def get_groq_client() -> Optional[Groq]:
    """
    Initialize and return Groq client
    Original logic from old backend.py get_groq_client() function (lines 470-490)
    
    Returns:
        Groq client instance or None if API key not available
    """
    global _groq_client
    
    if _groq_client is not None:
        return _groq_client
    
    api_key = get_groq_api_key()
    
    if not api_key:
        return None
    
    try:
        _groq_client = Groq(api_key=api_key)
        return _groq_client
    except Exception:
        return None


def build_prompt(soil: Dict, task: str, location: str = "") -> str:
    """
    Build AI prompt for different recommendation types
    Original logic from old backend.py build_prompt() function (lines 500-530)
    
    Args:
        soil: Soil data dictionary
        task: Type of recommendation ("summary", "crops", "fertilizer", "irrigation")
        location: Optional location string
        
    Returns:
        Formatted prompt string
    """
    
    # Base soil data description
    base = f"""Soil Data{f' - {location}' if location else ''}:
pH: {soil['pH']:.2f}, EC: {soil['EC']:.2f} dS/m, Moisture: {soil['Moisture']:.1f}%
N: {soil['Nitrogen']:.2f}, P: {soil['Phosphorus']:.2f}, K: {soil['Potassium']:.2f} mg/kg
Microbial: {soil['Microbial']:.2f}/10, Temp: {soil['Temperature']:.1f}°C"""
    
    # Task-specific prompts
    prompts = {
        "summary": f"{base}\n\nProvide: 1) Overall condition 2) Main concerns 3) Top 3 actions. Keep brief.",
        "crops": f"{base}\n\nSuggest TOP 5 suitable crops with reasons. Include Indian varieties.",
        "fertilizer": f"{base}\n\nProvide: NPK ratio, kg/hectare, timing, organic alternatives.",
        "irrigation": f"{base}\n\nProvide: frequency, water amount, best timing for irrigation."
    }
    
    return prompts.get(task, base)


def call_groq_api(prompt: str, model: str = None) -> str:
    """
    Call Groq API with retry logic
    Original logic from old backend.py call_groq() function (lines 540-620)
    
    Args:
        prompt: The prompt to send
        model: AI model to use (defaults to settings.DEFAULT_AI_MODEL)
        
    Returns:
        AI response text or error message
    """
    
    client = get_groq_client()
    if not client:
        return "⚠️ Configure GROQ_API_KEY in environment variables"
    
    if not model:
        model = settings.DEFAULT_AI_MODEL
    
    # Validate inputs
    if not prompt or not prompt.strip():
        return "⚠️ Error: Empty prompt"
    
    if len(prompt) > 10000:
        return "⚠️ Error: Prompt too long"
    
    # Retry logic
    max_retries = 3
    last_error = None
    
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an agricultural expert. Provide practical advice for Indian farmers in simple language."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.AI_TEMPERATURE,
                max_tokens=settings.AI_MAX_TOKENS,
                timeout=settings.AI_TIMEOUT
            )
            
            # Validate response
            if not response or not response.choices or not response.choices[0].message:
                return "⚠️ Error: Invalid response from AI service"
            
            content = response.choices[0].message.content
            if not content or not content.strip():
                return "⚠️ Error: Empty response from AI service"
            
            return content
            
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                time.sleep(1)  # Brief delay before retry
            continue
    
    # All retries failed
    error_msg = str(last_error) if last_error else "Unknown error"
    
    if "timeout" in error_msg.lower():
        return "⚠️ Request timed out. Please try again."
    elif "rate limit" in error_msg.lower():
        return "⚠️ Rate limit exceeded. Please wait a moment and try again."
    elif "api key" in error_msg.lower():
        return "⚠️ API key issue. Please check your configuration."
    else:
        return "⚠️ AI service temporarily unavailable. Please try again later."


def generate_ai_recommendation(
    soil_data: SoilData,
    recommendation_type: str,
    location: str = None,
    model: str = None
) -> str:
    """
    Generate AI recommendation for soil data
    
    Args:
        soil_data: Validated soil data
        recommendation_type: Type of recommendation ("summary", "crops", "fertilizer")
        location: Optional location string
        model: Optional AI model override
        
    Returns:
        AI-generated recommendation text
    """
    
    # Convert to dict
    soil_dict = soil_data.model_dump()
    
    # Build prompt
    prompt = build_prompt(soil_dict, recommendation_type, location or "")
    
    # Call API
    result = call_groq_api(prompt, model)
    
    return result
