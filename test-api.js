import 'dotenv/config';
import { writeFile } from "fs/promises";
import Replicate from "replicate";

console.log('🔑 API Token:', process.env.REPLICATE_API_TOKEN ? `${process.env.REPLICATE_API_TOKEN.substring(0, 8)}...` : 'NOT FOUND');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

const input = {
    prompt: "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot"
};

console.log('🎨 Starting generation...');

try {
  const output = await replicate.run("black-forest-labs/flux-schnell", { input });

  console.log('✅ Generation complete!');
  console.log('📸 Output:', output);

  // To access the file URLs:
  if (output && output[0]) {
    console.log('🔗 Image URL:', output[0]);
    
    // To write the files to disk:
    for (const [index, item] of Object.entries(output)) {
      const filename = `output_${index}.png`;
      await writeFile(filename, item);
      console.log(`💾 Saved: ${filename}`);
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Full error:', error);
}
