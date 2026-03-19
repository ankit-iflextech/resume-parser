import fs from 'node:fs';
import path from 'node:path';
import mammoth from 'mammoth';

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


const parseResume = async(filePath , fileName) => {
    
    const ext = path.extname(filePath).toLowerCase();

    if(ext === '.pdf'){
        const data = new Uint8Array(fs.readFileSync(filePath));
        console.log(data)
        const pdf = await pdfjsLib.getDocument({ data }).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            text += content.items.map(item => item.str).join(" ");
        }

        return text;
    }
    else if(ext === '.docx'){
        const result = await mammoth.extractRawText({path:filePath})
        return result.value
    }
    else if(ext === '.txt'){
        const data = fs.readFileSync(filePath, 'utf-8');
        return data
    }
    else{
        throw new Error('Unsupported file type');
    }
}

export default parseResume