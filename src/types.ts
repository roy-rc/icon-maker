export const STYLE_PRESETS = [
  {
    id: 'Pastels',
    name: 'Pastels',
    description: 'Soft edges, pastel palette, gentle gradients',
  },
  {
    id: 'Bubbles',
    name: 'Bubbles',
    description: 'Round bubbly shapes, glossy highlights',
  },
  {
    id: 'Neon Soft',
    name: 'Neon Soft',
    description: 'Glowing edges, soft neon rim lights',
  },
  {
    id: 'Clay Cute',
    name: 'Clay Cute',
    description: 'Soft 3D clay-like rendering, matte texture',
  },
  {
    id: 'Flat Pro',
    name: 'Flat Pro',
    description: 'Professional flat vector style, bold shapes',
  },
] as const;

export type StylePreset = typeof STYLE_PRESETS[number]['id'];

export interface GenerationRequest {
  prompt: string;
  style: StylePreset;
  colors?: string[];
}

export interface GeneratedIcon {
  url: string;
  index: number;
  concept: string;
}

export interface GenerationResponse {
  success: boolean;
  icons: GeneratedIcon[];
  metadata: {
    theme: string;
    style: string;
    colors: string[];
  };
}
