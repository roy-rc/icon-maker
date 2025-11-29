import type { VercelRequest, VercelResponse } from '@vercel/node';
import Replicate from 'replicate';

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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, style, colors = [] }: GenerateRequest = req.body;

    console.log('📝 Generation request:', { prompt, style, colors });

    if (!prompt || !style) {
      return res.status(400).json({ error: 'Prompt and style are required' });
    }

    if (!STYLE_PRESETS[style]) {
      return res.status(400).json({ error: 'Invalid style preset' });
    }

    const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN;
    
    if (!REPLICATE_TOKEN) {
      console.error('❌ REPLICATE_API_TOKEN not found');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const replicate = new Replicate({
      auth: REPLICATE_TOKEN,
    });

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

    console.log('🎨 Starting generation of 4 icons...');
    const results = await Promise.all(imagePromises);
    console.log('✅ Generation complete!');

    return res.status(200).json({
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
    return res.status(500).json({ 
      error: 'Failed to generate icons',
      details: error.message || 'Unknown error occurred'
    });
  }
}
