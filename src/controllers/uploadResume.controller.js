import anylyseResumeWithLLm from "../utils/analyseResumeWithLLm.js";
import parseResume from "../utils/resumeParse.js";
import { cache } from "../../src/intances/cache.js";
import { json } from "node:stream/consumers";

export const uploadResume =  async (req, res) => {

    const data = {
        filename : req.file.filename,
        filesize : req.file.size,
        filepath : req.file.path
    }
    return res.render("upload",{data});

}

export const anylsisResume = async (req, res) => {
    // 1. Set SSE headers FIRST
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 2. Helper to send events cleanly
    const send = (payload) => {
        res.write(`data:${JSON.stringify(payload)}\n\n`); // ← note double \n\n
    };

    // 3. Handle client disconnect
    req.on('close', () => {
        res.end();
        return;
    });

    try {
        const file = req.file;
        const { experience_level, target_role, sector, job_description } = req.body;

        send({ step: 'parse', status: 'processing', message: 'Parsing resume...' });
        const parsedText = await parseResume(file.path , file.filename); // your parse function
        send({ step: 'parse', status: 'complete', message: 'Resume parsed!' });

        const data = {
            resumeData: parsedText,
            target_role: target_role,
            experience_level: experience_level,
            sector: sector,
            job_description: job_description
        }
        send({ step: 'analyze', status: 'processing', message: 'Analyzing resume...' });
        const result = await anylyseResumeWithLLm(data); 
       
        const resultId = crypto.randomUUID();
        // ✅ Clean the AI response before JSON.parse
        const cleanAndParse = (str) => {
            const cleaned = str
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();

            // extract JSON object in case of extra text
            const match = cleaned.match(/\{[\s\S]*\}/);
            if (!match) throw new Error('No valid JSON in response');

            return JSON.parse(match[0]);
        };
        const parsed = cleanAndParse(result);
        cache.set(resultId, parsed);
        send({ step: 'analyze', status: 'complete', message: 'Analysis done!', data:resultId });
        send({ step: 'done', status: 'complete', message: 'All finished!' });
        res.end(); 

    } catch (err) {
        send({ step: 'error', status: 'error', message: err.message });
        res.end(); // ← end even on error
    }
};

