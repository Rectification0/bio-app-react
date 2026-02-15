# NutriSense Frontend

React + TypeScript + Vite frontend for NutriSense AI Soil Intelligence Platform.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

The app will be available at http://localhost:3000

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard view
│   │   ├── InputForm.tsx       # Soil data input form
│   │   ├── HistoryView.tsx     # Analysis history
│   │   ├── Guide.tsx           # User guide
│   │   └── LoadingSpinner.tsx  # Loading component
│   │
│   ├── services/
│   │   └── api.ts              # API client
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Features

### Dashboard
- Real-time soil health score
- Parameter analysis with status indicators
- AI-powered recommendations
- Visual health metrics

### Input Form
- 8 soil parameter inputs
- Real-time validation
- Location tracking
- Helpful tooltips

### History
- View past analyses
- Filter by location
- Export to CSV
- Delete records

### Guide
- Parameter explanations
- Optimal ranges
- Usage tips
- Health score breakdown

## 🔧 Development

### Available Scripts

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### API Endpoint

Update `VITE_API_URL` in `.env` to point to your backend:

```env
VITE_API_URL=https://your-api-domain.com
```

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Set these in your hosting platform:

```
VITE_API_URL=https://your-production-api.com
```

## 🔒 Security

- All API calls use HTTPS in production
- Input validation on both client and server
- CORS configured on backend
- No sensitive data in frontend code

## 🐛 Troubleshooting

### "Cannot connect to API"

Make sure the backend is running:
```bash
cd backend
uvicorn app.main:app --reload
```

### "Module not found"

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Port 3000 already in use"

Change the port in `vite.config.ts`:
```ts
server: {
  port: 3001
}
```

## 📖 API Integration

The frontend connects to these backend endpoints:

- `POST /api/analyze` - Analyze soil data
- `POST /api/analyze/recommendations/health-summary` - Get AI summary
- `POST /api/analyze/recommendations/crops` - Get crop recommendations
- `POST /api/analyze/recommendations/fertilizer` - Get fertilizer plan
- `GET /api/history` - Get analysis history
- `DELETE /api/history/{id}` - Delete record
- `POST /api/history/export` - Export CSV

See backend API docs at http://localhost:8000/docs

## 🎯 Performance

- Lazy loading for components
- Optimized bundle size
- Fast refresh in development
- Production build < 500KB

## 📝 License

Part of NutriSense - AI Soil Intelligence Platform
