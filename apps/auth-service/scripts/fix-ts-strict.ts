import * as fs from 'fs';
import * as path from 'path';

const foldersToFixProperties = ['src/auth/dto', 'src/auth/entities'];
const foldersToFixCatch = ['src/auth', 'src/health'];

// ------------------------
// Función para agregar ! a propiedades
// ------------------------
function processProperties(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Coincide con: "propiedad: tipo;"
  const regex = /^(\s*)([a-zA-Z0-9_]+):\s*([a-zA-Z0-9_\<\>\[\]]+);/gm;

  content = content.replace(regex, (match, indent, name, type) => {
    if (match.includes('!') || match.includes('()')) return match;
    return `${indent}${name}!: ${type};`;
  });

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Propiedades procesadas: ${filePath}`);
}

// ------------------------
// Función para arreglar catch (error)
// ------------------------
function processCatchBlocks(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Detecta try/catch sin tipo en error
  const catchRegex = /catch\s*\(\s*error\s*\)/g;
  content = content.replace(catchRegex, 'catch (error: unknown)');

  // Reemplaza usage de error.stack por (error as Error).stack
  const stackRegex = /error\.stack/g;
  content = content.replace(stackRegex, '(error as Error).stack');

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Catch blocks procesados: ${filePath}`);
}

// ------------------------
// Función para recorrer carpetas
// ------------------------
function walkDir(dir: string, callback: (filePath: string) => void) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith('.ts')) {
      callback(fullPath);
    }
  }
}

// ------------------------
// Ejecutar script
// ------------------------
for (const folder of foldersToFixProperties) {
  walkDir(folder, processProperties);
}

for (const folder of foldersToFixCatch) {
  walkDir(folder, processCatchBlocks);
}

console.log('🎉 Todo listo: propiedades y catch blocks corregidos.');
