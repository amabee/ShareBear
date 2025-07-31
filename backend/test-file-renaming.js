import { generateFileName, RENAME_STRATEGIES } from './src/utils/file-utils.js';

// Mock file object for testing
const mockFile = {
  originalname: 'my-awesome-photo.jpg',
  buffer: Buffer.from('fake image data'),
  size: 1024 * 1024, // 1MB
  mimetype: 'image/jpeg'
};

console.log('=== File Renaming Strategy Demo ===\n');

// Test all strategies
const strategies = [
  { name: 'UUID', strategy: RENAME_STRATEGIES.UUID },
  { name: 'Timestamp', strategy: RENAME_STRATEGIES.TIMESTAMP },
  { name: 'Hash', strategy: RENAME_STRATEGIES.HASH },
  { name: 'User Specific', strategy: RENAME_STRATEGIES.USER_SPECIFIC },
  { name: 'Original (Sanitized)', strategy: RENAME_STRATEGIES.ORIGINAL }
];

strategies.forEach(({ name, strategy }) => {
  try {
    const newFileName = generateFileName(mockFile, strategy, 'user123');
    console.log(`${name}:`);
    console.log(`  Original: ${mockFile.originalname}`);
    console.log(`  New:      ${newFileName}`);
    console.log('');
  } catch (error) {
    console.log(`${name}: Error - ${error.message}\n`);
  }
});

console.log('=== Strategy Recommendations ===');
console.log('• UUID: Best for security and uniqueness');
console.log('• Timestamp: Good for chronological organization');
console.log('• Hash: Prevents duplicate uploads, good for deduplication');
console.log('• User Specific: Good for user organization and debugging');
console.log('• Original: Keeps original names (sanitized)'); 
