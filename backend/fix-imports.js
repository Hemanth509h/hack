import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    const importRegex = /(import\s+[\s\S]*?from\s+['"])(\..*?)(['"];?)/g;
    const sideEffectRegex = /(import\s+['"])(\..*?)(['"];?)/g;
    const dynamicImportRegex = /(import\(['"])(\..*?)(['"]\))/g;
    
    const replacer = (match, p1, p2, p3) => {
        if (p2.endsWith('.js') || p2.endsWith('.json') || p2.endsWith('.ts')) {
            return match;
        }
        
        let targetPath = path.resolve(path.dirname(file), p2);
        
        try {
            const stat = fs.statSync(targetPath);
            if (stat.isDirectory()) {
                return `${p1}${p2}/index.js${p3}`;
            }
        } catch (e) {
            try {
                if (fs.existsSync(targetPath + '.js')) {
                    return `${p1}${p2}.js${p3}`;
                }
                if (fs.existsSync(targetPath + '.ts')) {
                    return `${p1}${p2}.js${p3}`;
                }
            } catch(err) {}
        }
        
        return `${p1}${p2}.js${p3}`;
    };

    let newContent = content.replace(importRegex, replacer);
    newContent = newContent.replace(sideEffectRegex, replacer);
    newContent = newContent.replace(dynamicImportRegex, replacer);
    
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed imports in', file);
    }
});
