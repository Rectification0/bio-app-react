"""
Soil Analysis Service
Extracted from old backend.py - all soil parameter analysis logic
"""

from typing import Dict, Tuple
from ..models import SoilData, ParameterInterpretation
from ..config import settings


def calculate_health_score(soil_data: SoilData) -> float:
    """
    Calculate overall soil health score (0-100)
    
    Original logic from old backend.py get_health_score() function (lines 230-270)
    
    Algorithm:
    - pH component (25 points max): Optimal at 7.0, decreases with distance
    - EC component (25 points max): Lower is better, penalty for high salinity
    - Moisture component (20 points max): Optimal range 25-40%
    - NPK component (30 points max): Based on nutrient availability
    
    Args:
        soil_data: Validated SoilData object
        
    Returns:
        Health score between 0 and 100
    """
    try:
        # Convert to dict for easier access
        soil = soil_data.model_dump()
        
        # pH component (25 points) - optimal at 7.0
        ph = max(0, min(25, 25 - abs(soil['pH'] - 7.0) * 3.5))
        
        # EC component (25 points) - lower is better
        ec = max(0, min(25, 25 - min(soil['EC'], 4.0) * 6.25))
        
        # Moisture component (20 points) - optimal range 25-40%
        if 25 <= soil['Moisture'] <= 40:
            moist = 20
        else:
            moist = max(0, min(20, 20 - abs(soil['Moisture'] - 32.5) * 0.5))
        
        # NPK component (30 points total - 10 each)
        n_score = min(soil['Nitrogen'] / 80 * 10, 10)
        p_score = min(soil['Phosphorus'] / 50 * 10, 10)
        k_score = min(soil['Potassium'] / 250 * 10, 10)
        npk = n_score + p_score + k_score
        
        # Total score
        score = min(max(ph + ec + moist + npk, 0), 100)
        
        return round(score, 2)
        
    except Exception as e:
        # Return neutral score on error
        return 50.0


def interpret_parameter(param: str, val: float) -> Tuple[str, str]:
    """
    Interpret a soil parameter and return (status, emoji)
    
    Original logic from old backend.py interpret() function (lines 280-320)
    
    Returns status classification and emoji for each parameter based on
    agronomic optimal ranges.
    
    Args:
        param: Parameter name (pH, EC, Moisture, etc.)
        val: Parameter value
        
    Returns:
        Tuple of (status_string, emoji_string)
    """
    
    # Parameter interpretation ranges
    # Format: (min, max, status, emoji)
    interpretation_data = {
        'pH': [
            (0, 5.5, "Acidic", "🔴"),
            (5.5, 6.5, "Low", "🟡"),
            (6.5, 7.5, "Optimal", "🟢"),
            (7.5, 8.5, "High", "🟡"),
            (8.5, 15, "Alkaline", "🔴")
        ],
        'EC': [
            (0, 0.8, "Low", "🟢"),
            (0.8, 2, "Moderate", "🟡"),
            (2, 4, "High", "🟠"),
            (4, 25, "Very High", "🔴")
        ],
        'Moisture': [
            (0, 15, "Dry", "🔴"),
            (15, 25, "Low", "🟡"),
            (25, 40, "Optimal", "🟢"),
            (40, 60, "High", "🟡"),
            (60, 101, "Wet", "🔴")
        ],
        'Nitrogen': [
            (0, 40, "Low", "🔴"),
            (40, 80, "Optimal", "🟢"),
            (80, 501, "High", "🟡")
        ],
        'Phosphorus': [
            (0, 20, "Low", "🔴"),
            (20, 50, "Optimal", "🟢"),
            (50, 201, "High", "🟡")
        ],
        'Potassium': [
            (0, 100, "Low", "🔴"),
            (100, 250, "Optimal", "🟢"),
            (250, 501, "High", "🟡")
        ],
        'Microbial': [
            (0, 3, "Poor", "🔴"),
            (3, 7, "Good", "🟢"),
            (7, 11, "Excellent", "💚")
        ],
        'Temperature': [
            (0, 10, "Cold", "🔵"),
            (10, 30, "Optimal", "🟢"),
            (30, 51, "Hot", "🔴")
        ]
    }
    
    # Get ranges for parameter
    ranges = interpretation_data.get(param, [])
    
    # Find matching range
    for low, high, status, emoji in ranges:
        if low <= val < high:
            return status, emoji
    
    # Default if no match
    return "Unknown", "⚪"


def get_parameter_unit(param: str) -> str:
    """Get the unit for a parameter"""
    units = {
        'pH': 'pH',
        'EC': 'dS/m',
        'Moisture': '%',
        'Nitrogen': 'mg/kg',
        'Phosphorus': 'mg/kg',
        'Potassium': 'mg/kg',
        'Microbial': 'Index',
        'Temperature': '°C'
    }
    return units.get(param, '')


def analyze_soil_data(soil_data: SoilData, location: str = None) -> Dict:
    """
    Perform complete soil analysis
    
    Args:
        soil_data: Validated soil data
        location: Optional location string
        
    Returns:
        Dictionary with health score and parameter interpretations
    """
    from datetime import datetime
    
    # Calculate health score
    health_score = calculate_health_score(soil_data)
    
    # Interpret each parameter
    parameters = {}
    soil_dict = soil_data.model_dump()
    
    for param_name, value in soil_dict.items():
        status, emoji = interpret_parameter(param_name, value)
        unit = get_parameter_unit(param_name)
        
        parameters[param_name] = ParameterInterpretation(
            value=value,
            status=status,
            emoji=emoji,
            unit=unit
        )
    
    return {
        "health_score": health_score,
        "parameters": parameters,
        "timestamp": datetime.now(),
        "location": location
    }
