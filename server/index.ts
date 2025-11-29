import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Explicitly set the API token
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;

console.log('🔑 Replicate API Token loaded:', REPLICATE_TOKEN ? `${REPLICATE_TOKEN.substring(0, 8)}...` : 'NOT FOUND');

const replicate = new Replicate({
  auth: REPLICATE_TOKEN,
});

// Style preset definitions for prompt engineering
const STYLE_PRESETS = {
  'Pastels': 'soft edges, pastel color palette, gentle gradients, airy minimalism, light and dreamy aesthetic',
  'Bubbles': 'round bubbly shapes, glossy highlights, playful curves, shiny bubble-like surfaces',
  'Neon Soft': 'glowing edges, soft neon rim lights, dark-to-color contrast, luminous glow effect',
  'Clay Cute': 'soft 3D clay-like rendering, matte texture, rounded edges, tactile appearance',
  'Flat Pro': 'professional flat vector style, bold shapes, sharp edges, limited color palette, clean lines'
};

// Icon concepts to ensure variety
const getIconVariations = (theme: string) => [
  `primary ${theme} icon`,
  `secondary ${theme} icon`,
  `alternative ${theme} icon`,
  `complementary ${theme} icon`
];

interface GenerateRequest {
  prompt: string;
  style: keyof typeof STYLE_PRESETS;
  colors?: string[];
}

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, style, colors = [] }: GenerateRequest = req.body;

    console.log('📝 Generation request:', { prompt, style, colors });

    if (!prompt || !style) {
      return res.status(400).json({ error: 'Prompt and style are required' });
    }

    if (!STYLE_PRESETS[style]) {
      return res.status(400).json({ error: 'Invalid style preset' });
    }

    const styleDescription = STYLE_PRESETS[style];
    const colorGuidance = colors.length > 0 
      ? `Use this color palette: ${colors.join(', ')}. ` 
      : '';

    // Generate 4 distinct icons
    const iconVariations = getIconVariations(prompt);
    const imagePromises = iconVariations.map(async (variation, index) => {
      const fullPrompt = `A single clean icon of ${variation} related to "${prompt}". 
${colorGuidance}Style: ${styleDescription}. 
Requirements:
- 512x512 resolution
- Simple, recognizable silhouette
- Consistent line weight and shading
- NO text, letters, or watermarks
- Uniform background
- Icon number ${index + 1} of 4 (ensure distinct from others)
- Center the icon in the frame
- Professional icon design`;

      const output = await replicate.run(
        "black-forest-labs/flux-schnell",
        {
          input: {
            prompt: fullPrompt,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "png",
            output_quality: 90,
            disable_safety_checker: false
          }
        }
      ) as string[];

      return {
        url: output[0],
        index: index + 1,
        concept: variation
      };
    });

    // Execute all generations in parallel for efficiency
    console.log('🎨 Starting generation of 4 icons...');
    const results = await Promise.all(imagePromises);
    console.log('✅ Generation complete!');

    res.json({
      success: true,
      icons: results,
      metadata: {
        theme: prompt,
        style: style,
        colors: colors
      }
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate icons',
      details: error.message || 'Unknown error occurred'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
