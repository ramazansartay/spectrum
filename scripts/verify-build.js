import fs from 'fs';
import path from 'path';

const filesToCheck = [
  'dist/index.js',
  'dist/public/index.html'
];

console.log('Verifying build output...');

for (const file of filesToCheck) {
  if (!fs.existsSync(path.resolve(file))) {
    console.error(`❌ Build verification failed: File not found at ${file}`);
    process.exit(1); // Завершить с ошибкой
  }
  console.log(`✅ Found: ${file}`);
}

console.log('Build output verified successfully!');
process.exit(0);
