import 'dotenv/config';
import Replicate from "replicate";

const token = process.env.REPLICATE_API_TOKEN;

console.log('🔑 Full Token:', token);
console.log('📏 Token Length:', token.length);
console.log('🔤 Token Format Check:', token.startsWith('r8_') ? '✅ Valid format' : '❌ Invalid format');

// Try to verify account
const replicate = new Replicate({ auth: token });

console.log('\n🔍 Testing authentication...\n');

try {
  // Try to list models to verify auth
  const models = await replicate.models.list();
  console.log('✅ Authentication successful!');
  console.log('📦 Available models:', models.results?.length || 0);
} catch (error) {
  console.error('❌ Authentication failed:', error.message);
  console.error('\n💡 Possible issues:');
  console.error('   1. The API token may have expired');
  console.error('   2. The token may be invalid or revoked');
  console.error('   3. You may need to generate a new token at: https://replicate.com/account/api-tokens');
  console.error('\n📝 Current token being used:', token);
}
