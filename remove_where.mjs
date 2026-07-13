import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'src', 'components');

let changedCount = 0;
const files = fs.readdirSync(dir);

for (const file of files) {
    if (!file.endsWith('.svelte')) continue;
    const filePath = path.join(dir, file);
    const oldContent = fs.readFileSync(filePath, 'utf8');

    // First pass: replace :where(CONTENT) when there are no inner parens
    let newContent = oldContent.replace(/:where\(([^()]+)\)/g, "$1");

    // Second pass: handle the edge cases where there might still be :where()
    newContent = newContent.replace(/:where\(([^)]+)\)/g, "$1");

    // Third pass for multiline nested ones if any (Svelte Text.svelte had some nested ones)
    // using regex with non-greedy anything inside up to the parenthesis balance
    let index = 0;
    while ((index = newContent.indexOf(':where(', index)) !== -1) {
        let openCount = 1;
        let closeIndex = index + 7;
        while (openCount > 0 && closeIndex < newContent.length) {
            if (newContent[closeIndex] === '(') openCount++;
            else if (newContent[closeIndex] === ')') openCount--;
            closeIndex++;
        }

        if (openCount === 0) {
            const inner = newContent.slice(index + 7, closeIndex - 1);
            newContent = newContent.slice(0, index) + inner + newContent.slice(closeIndex);
            // index stays the same since we reduced the string length, so the next possible :where 
            // is at or after this index.
        } else {
            console.warn(`Unbalanced parens in ${file} at index ${index}`);
            index += 7; // avoid loop
        }
    }

    if (newContent !== oldContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        changedCount++;
        console.log('Updated', file);
    }
}
console.log('Total files updated:', changedCount);
