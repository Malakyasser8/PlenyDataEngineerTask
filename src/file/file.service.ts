import * as fs from 'fs';
import * as path from 'path';
import { Brand } from 'src/schemas/brand.schema';

export function readData(dirname: string): any[] {
  const filePath = path.resolve(dirname);
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

export function writeBrands(brands: (typeof Brand)[]) {
  fs.writeFileSync('new-brands.json', JSON.stringify(brands, null, 2), 'utf8');
}
