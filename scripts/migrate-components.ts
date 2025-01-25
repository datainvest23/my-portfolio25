import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'components/ui');
const TARGET_DIR = path.join(ROOT_DIR, 'src/components/ui');

// Files to migrate
const FILES_TO_MIGRATE = [
  '3d-button.tsx',
  'animated-grid-pattern.tsx',
  'chat-bubble.tsx',
  'flip-card.tsx',
  'flip-words.tsx',
  'globe.tsx',
  'hover-card.tsx',
  'interesting-button.tsx',
  'magnetize-button.tsx',
  'message-loading.tsx',
  'orb-effect.tsx',
  'sidebar.tsx',
];

// Create target directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Move files and update imports
FILES_TO_MIGRATE.forEach(file => {
  const sourcePath = path.join(SOURCE_DIR, file);
  const targetPath = path.join(TARGET_DIR, file);

  if (fs.existsSync(sourcePath)) {
    // Read file content
    let content = fs.readFileSync(sourcePath, 'utf8');

    // Update relative imports to use @/ alias
    content = content.replace(
      /from ['"]\.\.\/\.\.\//g,
      'from \'@/'
    );
    content = content.replace(
      /from ['"]\.\.\/(?!\.)/g,
      'from \'@/components/'
    );

    // Write to new location
    fs.writeFileSync(targetPath, content);
    console.log(`✅ Migrated ${file}`);

    // Delete original file
    fs.unlinkSync(sourcePath);
    console.log(`🗑️  Deleted original ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

// Try to remove the original directory if empty
try {
  fs.rmdirSync(SOURCE_DIR);
  console.log('🗑️  Removed empty source directory');
} catch (error) {
  console.log('⚠️  Could not remove source directory (might not be empty)');
}

console.log('Migration complete!'); 