const fs = require('fs');

const files = [
  'src/controllers/auth.controller.ts',
  'src/controllers/award.controller.ts',
  'src/controllers/film.controller.ts',
  'src/controllers/gellery.controller.ts',
  'src/controllers/user.controller.ts',
  'src/controllers/vote.controller.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Insert imports
  if (!content.includes('catchAsync')) {
    content = `import { catchAsync } from "../utils/catchAsync.js";\nimport { AppError } from "../utils/AppError.js";\n` + content;
  }

  // Find all try catch blocks in export const
  content = content.replace(/export const (\w+) = async \(req, res\) => \{\s*try \{([\s\S]*?)\}\s*catch\s*\(.*?\)\s*\{[\s\S]*?\}\s*\};/g, 
    (match, name, inner) => {
      // Remove generic error returns, they will be handled by catchAsync
      return `export const ${name} = catchAsync(async (req: any, res: any, next: any) => {\n  ${inner.trim()}\n});`;
    }
  );

  fs.writeFileSync(file, content);
});

console.log("Refactored controllers!");
