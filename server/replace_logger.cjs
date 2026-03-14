const fs = require('fs');
const cp = require('child_process');

// find all ts files in src except index.ts, utils/logger.ts
const files = cp.execSync('find src -name "*.ts"').toString().split('\n').filter(Boolean).filter(f => !f.includes('logger.ts') && !f.includes('index.ts') && !f.includes('emailQueue.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('console.log') || content.includes('console.error')) {
    content = content.replace(/console\.log/g, 'logger.info');
    content = content.replace(/console\.error/g, 'logger.error');
    content = content.replace(/console\.warn/g, 'logger.warn');
    
    // figure out path to logger
    const depth = file.split('/').length - 2; // src/services/file.ts -> 2 - 2 = 0? Wait. split: ['src', 'services', 'file.ts'] -> len 3. 3-2 = 1 => '../'.
    const prefix = depth === 0 ? './' : '../'.repeat(depth);
    const importStmt = `import { logger } from "${prefix}utils/logger.js";\n`;
    
    if (!content.includes('import { logger }')) {
      content = importStmt + content;
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed logger in', file);
  }
});
