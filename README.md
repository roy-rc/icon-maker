# IconMaker 🎨

Generate consistent icon sets with AI using a single prompt. Built with React, TypeScript, Node.js, and the Replicate API.

## Features

- **4 Unique Icons**: Generate 4 distinct, themed icons from a single prompt
- **5 Preset Styles**: Choose from Pastels, Bubbles, Neon Soft, Clay Cute, or Flat Pro
- **Brand Color Support**: Optionally provide HEX colors to guide the palette
- **High Quality**: 512x512 PNG outputs
- **Easy Download**: Download individual icons or all at once
- **Consistent Styling**: All icons share the same visual language and design treatment

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI Model**: FLUX Schnell via Replicate API
- **Styling**: Pure CSS with modern features

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Replicate API token (already configured in `.env`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. The `.env` file is already configured with the API token.

### Running the Application

You'll need to run both the frontend and backend:

#### Terminal 1 - Backend Server:
```bash
npm run server
```

#### Terminal 2 - Frontend Dev Server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Enter a Theme**: Type a theme for your icon set (e.g., "Toys", "Space", "Food")
2. **Select a Style**: Choose one of the 5 preset styles
3. **Add Colors** (Optional): Enter up to 3 HEX color codes for brand palette
4. **Generate**: Click "Generate Icon Set" and wait 20-30 seconds
5. **Download**: Download individual icons or all 4 at once

## Style Presets

1. **Pastels**: Soft edges, pastel palette, gentle gradients, airy minimalism
2. **Bubbles**: Round bubbly shapes, glossy highlights, playful curves
3. **Neon Soft**: Glowing edges, soft neon rim lights, dark-to-color contrast
4. **Clay Cute**: Soft 3D clay-like rendering, matte texture, rounded edges
5. **Flat Pro**: Professional flat vector style, bold shapes, sharp edges

## API Integration

The app uses the Replicate API with the FLUX Schnell model:
- **Model**: `black-forest-labs/flux-schnell`
- **Output Format**: PNG
- **Resolution**: 512x512
- **Parallel Generation**: All 4 icons are generated simultaneously for efficiency

## Architecture

```
IconMaker/
├── server/
│   └── index.ts          # Express API server
├── src/
│   ├── components/       # React components
│   │   ├── IconForm      # Input form
│   │   ├── IconGrid      # Results display
│   │   ├── LoadingSpinner
│   │   └── ErrorMessage
│   ├── api.ts            # API client functions
│   ├── types.ts          # TypeScript definitions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
└── package.json
```

## Error Handling

- API failures show user-friendly error messages
- Retry functionality on errors
- Loading states during generation
- Input validation on both frontend and backend

## Deployment Considerations

### For Production:

1. **Environment Variables**: Move API token to secure environment variables
2. **Rate Limiting**: Add rate limiting to prevent API abuse
3. **Caching**: Consider caching common requests
4. **Build**: Run `npm run build` to create production bundle
5. **Hosting Options**:
   - Frontend: Vercel, Netlify, or any static host
   - Backend: Render, Railway, Heroku, or any Node.js host

### Quick Deploy Example (Vercel):

1. Deploy backend as a serverless function or separate service
2. Update `VITE_API_URL` environment variable to point to backend
3. Deploy frontend: `vercel deploy`

## Cost Optimization

- Parallel generation reduces total wait time
- No repeated requests for same parameters (consider adding caching)
- Error handling prevents wasted API calls
- User can preview before committing to downloads

## Testing Recommendations

- Test various themes (abstract vs concrete)
- Test each style preset
- Test with/without brand colors
- Test error scenarios (network issues, invalid inputs)
- Test download functionality across browsers

## Future Enhancements

- [ ] Request caching to avoid duplicate API calls
- [ ] More granular style controls
- [ ] Aspect ratio options
- [ ] Icon editing/refinement
- [ ] Gallery of generated sets
- [ ] User accounts and history
- [ ] Batch generation for multiple themes
