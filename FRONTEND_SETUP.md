# Frontend Setup Guide

Complete guide to set up and run the NutriSense React frontend.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Node.js

Make sure you have Node.js 18+ installed:

```bash
node --version
# Should show v18.0.0 or higher
```

If not installed, download from: https://nodejs.org/

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages (React, TypeScript, Vite, Tailwind, etc.)

### Step 3: Configure Environment

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

The `.env` file should contain:
```env
VITE_API_URL=http://localhost:8000
```

### Step 4: Start Backend API

In a separate terminal, make sure your backend is running:

```bash
cd backend
venv\Scripts\activate    # Windows
source venv/bin/activate # Linux/Mac
uvicorn app.main:app --reload
```

Backend should be running at http://localhost:8000

### Step 5: Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will start at http://localhost:3000

### Step 6: Open in Browser

Open http://localhost:3000 in your browser!

---

## 📦 What Gets Installed

From `package.json`:

### Dependencies (Production)
- `react` & `react-dom` - UI library
- `axios` - HTTP client for API calls
- `react-router-dom` - Routing (if needed)
- `lucide-react` - Beautiful icons

### Dev Dependencies
- `typescript` - Type safety
- `vite` - Fast build tool
- `tailwindcss` - Utility-first CSS
- `@vitejs/plugin-react` - React support for Vite
- ESLint - Code linting

---

## 🎨 Features Overview

### 1. Dashboard Tab
- View latest soil analysis
- Health score with visual indicator
- Parameter breakdown with status
- AI recommendations (summary, crops, fertilizer)

### 2. Input Tab
- Enter 8 soil parameters
- Location tracking
- Real-time validation
- Helpful tooltips for each parameter

### 3. History Tab
- View all past analyses
- Filter by location
- Export to CSV
- Delete records

### 4. Guide Tab
- Parameter explanations
- Optimal ranges
- Usage tips
- Health score breakdown

---

## 🔧 Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Making Changes

1. Edit files in `src/`
2. Vite will auto-reload
3. Check browser for changes
4. No need to restart server

### File Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── InputForm.tsx   # Soil data input
│   ├── HistoryView.tsx # History view
│   ├── Guide.tsx       # User guide
│   └── LoadingSpinner.tsx
│
├── services/
│   └── api.ts          # API client (axios)
│
├── types/
│   └── index.ts        # TypeScript types
│
├── App.tsx             # Main app
├── main.tsx            # Entry point
└── index.css           # Global styles
```

---

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Change API URL

Edit `.env`:

```env
VITE_API_URL=http://your-api-url:8000
```

### Add New Component

```bash
# Create new component
touch src/components/MyComponent.tsx
```

```tsx
// src/components/MyComponent.tsx
export default function MyComponent() {
  return (
    <div className="card">
      <h2>My Component</h2>
    </div>
  )
}
```

---

## 🚀 Building for Production

### Build

```bash
npm run build
```

This creates an optimized build in `dist/` folder.

### Preview Build

```bash
npm run preview
```

Test the production build locally.

### Deploy

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard
```

#### Option 3: Static Hosting

Upload the `dist/` folder to any static hosting:
- GitHub Pages
- AWS S3
- Azure Static Web Apps
- Cloudflare Pages

---

## 🐛 Troubleshooting

### "Cannot find module 'react'"

```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"

Edit `vite.config.ts`:

```ts
server: {
  port: 3001  // Change to any available port
}
```

### "Failed to fetch" errors

1. Check backend is running: http://localhost:8000/health
2. Check CORS is configured in backend
3. Verify `VITE_API_URL` in `.env`

### TypeScript errors

```bash
# Check for errors
npm run build

# If errors persist, check tsconfig.json
```

### Styling not working

```bash
# Rebuild Tailwind
npm run dev
```

Make sure `index.css` imports Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 📱 Testing on Mobile

### Local Network Testing

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   
   # Linux/Mac
   ifconfig
   ```

2. Update `vite.config.ts`:
   ```ts
   server: {
     host: '0.0.0.0',
     port: 3000
   }
   ```

3. Access from mobile: `http://your-ip:3000`

---

## 🔒 Security Checklist

- [ ] Never commit `.env` file
- [ ] Use HTTPS in production
- [ ] Set proper CORS on backend
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Keep dependencies updated

---

## 📊 Performance Tips

### Optimize Bundle Size

```bash
# Analyze bundle
npm run build
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./components/Dashboard'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Dashboard />
    </Suspense>
  )
}
```

### Image Optimization

- Use WebP format
- Compress images
- Lazy load images

---

## 🎓 Learning Resources

### React
- Official Docs: https://react.dev/
- Tutorial: https://react.dev/learn

### TypeScript
- Official Docs: https://www.typescriptlang.org/
- Handbook: https://www.typescriptlang.org/docs/handbook/

### Vite
- Official Docs: https://vitejs.dev/
- Guide: https://vitejs.dev/guide/

### Tailwind CSS
- Official Docs: https://tailwindcss.com/
- Playground: https://play.tailwindcss.com/

---

## 🆘 Getting Help

### Check These First

1. **Backend running?** http://localhost:8000/health
2. **Dependencies installed?** `npm install`
3. **Environment configured?** Check `.env` file
4. **Console errors?** Open browser DevTools (F12)

### Common Issues

| Issue | Solution |
|-------|----------|
| White screen | Check browser console for errors |
| API errors | Verify backend is running |
| Styling broken | Restart dev server |
| TypeScript errors | Run `npm run build` to see details |

---

## ✅ Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] Backend API running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created
- [ ] Dev server started (`npm run dev`)
- [ ] Browser opened to http://localhost:3000

---

## 🎉 You're Ready!

Your frontend is now running with:
- ✅ React 18 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ Vite for fast development
- ✅ API integration with backend
- ✅ Responsive design
- ✅ Modern UI components

Start building! 🚀
