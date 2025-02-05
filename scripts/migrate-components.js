const fs = require('fs');
const path = require('path');

const ROOT_DIR = process.cwd();
const SOURCE_UI_DIR = path.join(ROOT_DIR, 'components/ui');
const TARGET_UI_DIR = path.join(ROOT_DIR, 'src/components/ui');
const SOURCE_COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const TARGET_COMPONENTS_DIR = path.join(ROOT_DIR, 'src/components');

// Create target directories if they don't exist
if (!fs.existsSync(TARGET_UI_DIR)) {
  fs.mkdirSync(TARGET_UI_DIR, { recursive: true });
}
if (!fs.existsSync(TARGET_COMPONENTS_DIR)) {
  fs.mkdirSync(TARGET_COMPONENTS_DIR, { recursive: true });
}

// UI components to migrate
const UI_FILES = [
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

// Regular components to migrate
const COMPONENT_FILES = [
  'PortfolioCard.tsx',
  'TableOfContents.tsx',
  'RelatedProjectCard.tsx',
  'InterestButton.tsx',
  'AnimatedHeaderCard.tsx'
];

// Function to migrate files
function migrateFiles(files, sourceDir, targetDir) {
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

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
}

// Migrate UI components
console.log('Migrating UI components...');
migrateFiles(UI_FILES, SOURCE_UI_DIR, TARGET_UI_DIR);

// Migrate regular components
console.log('Migrating regular components...');
migrateFiles(COMPONENT_FILES, SOURCE_COMPONENTS_DIR, TARGET_COMPONENTS_DIR);

// Try to remove empty directories
try {
  fs.rmdirSync(SOURCE_UI_DIR);
  console.log('🗑️  Removed empty UI directory');
} catch (error) {
  console.log('⚠️  Could not remove UI directory (might not be empty)');
}

try {
  fs.rmdirSync(SOURCE_COMPONENTS_DIR);
  console.log('🗑️  Removed empty components directory');
} catch (error) {
  console.log('⚠️  Could not remove components directory (might not be empty)');
}

console.log('Migration complete!'); 