import anylyseResumeWithLLm from "../utils/analyseResumeWithLLm.js";
import parseResume from "../utils/resumeParse.js";


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

        // Step 1 — parse
        send({ step: 'parse', status: 'processing', message: 'Parsing resume...' });
        console.log('parsing');
        const parsedText = await parseResume(file); // your parse function
        console.log('parsed')
        send({ step: 'parse', status: 'complete', message: 'Resume parsed!' });

        // Step 2 — analyze
        send({ step: 'analyze', status: 'processing', message: 'Analyzing resume...' });
        console.log('analyzing')
        const result = await analyzeWithAI(parsedText); // your AI function
        send({ step: 'analyze', status: 'complete', message: 'Analysis done!', data: result });

        // 4. End the stream — DO NOT call res.render/res.json after this
        send({ step: 'done', status: 'complete', message: 'All finished!' });
        res.end(); // ← only end, never res.send/render

    } catch (err) {
        send({ step: 'error', status: 'error', message: err.message });
        res.end(); // ← end even on error
    }
};

