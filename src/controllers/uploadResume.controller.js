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

export const anylsisResume = async(req, res) =>{

   const { filepath, filename, experience_level, target_role, sector, job_description } = req.body;
    // 1. Tell browser — "keep this connection open, I'll keep sending"
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
     // parsing resume 
    res.write(`data: ${JSON.stringify({status:'parsing_start'})}\n`);
    const parsedData =  await parseResume(filepath, filename);
    res.write(`data:${JSON.stringify({status:'parsing_done'})}\n`)
    const data = {
        resumeData: parsedData,
        experience_level,
        target_role,
        sector,
        job_description
    }
   
    // analised raw text from via llm
    res.write(`data:${JSON.stringify({status:'analysis_start'})}\n`)
    const anylsis = await anylyseResumeWithLLm(data);
    res.write(`data:${JSON.stringify({status:'analysis_done'})}\n`)

    console.log(anylsis);

    return res.render('suggestion');
}

