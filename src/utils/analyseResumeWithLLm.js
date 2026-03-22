import { Mistral } from '@mistralai/mistralai';
const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';


const promptBuilder = (data) => {
    return  `Return a structured ATS evaluation report in STRICT JSON format. 

### CONTEXT:
The following text is extracted from a candidate's resume (PDF/Docx/Txt). Your goal is to act as an advanced Applicant Tracking System (ATS) and provide a cold, analytical assessment of their fit for the specified role.

### INPUT DATA:
- RESUME TEXT: """${data.resumeData}"""
- TARGET ROLE: """${data.target_role || "Inferred from resume"}"""
- JOB DESCRIPTION: """${data.job_description || "Analyze based on industry standards for the role"}"""
- EXPERIENCE LEVEL: """${data.experience_level || "Inferred"}"""
- SECTOR: """${data.sector || "Inferred"}"""

### CONSTRAINTS:
1. NO MARKDOWN: Do not use bold (**) or italics (_) in the JSON values.
2. NO PROSE: Do not include any introductory or concluding text. 
3. FORMAT: Return ONLY the JSON object.
4. VALIDATION: Ensure all quotes are escaped and the JSON is parsable by standard libraries.
5. METRICS: Be strict. If achievements aren't quantified (numbers/ percentages), lower the "experience" and "ats_score".

STRICT RULES:
    - Return ONLY valid JSON, no markdown, no backticks
    - Keep all string values concise (max 100 chars each)
    - Do not truncate the JSON — complete all arrays and objects
    - No trailing commas
    - No comments inside JSON

### OUTPUT STRUCTURE:
{
  "person_details": {
    "name": "String",
    "email": "String",
    "phone": "String",
    "address": "String",
  },
  "target_role": "String",
  "experience_level": "String",
  "sector": "String",
  "ats_score": {
    "score": [Integer 0-100],
    "status": ["Excellent", "Good", or "Needs Improvement"]
  },
  "category_scores": {
    "keywords": [Integer],
    "formatting": [Integer],
    "experience": [Integer],
    "education": [Integer],
    "skills_match": [Integer]
  },
  "action_items": [
    {
      "title": "String",
      "description": "String (No bolding or markdown)",
      "severity": ["Critical", "Important", "Tip"]
    }
  ],
  "keyword_analysis": {
    "present": ["List of strings"],
    "missing": ["List of strings"],
    "partial": ["List of strings"]
  },
  "improvement_suggestions": ["List of specific bullet-point rewrites"],
  "summary": "2-3 line objective analysis of the candidate's profile."
}
`
}

const anylyseResumeWithLLm = async (data) => {
    try {
        const client = new Mistral({apiKey: apiKey});
        const prompt = promptBuilder(data);
        const chatResponse = await client.chat.complete({
            model: 'mistral-medium-latest',
            max_tokens: 4000,
            response_format: { type: 'json_object' },
            messages: [{role: 'user', content: prompt}],
        });

        // console.log(chatResponse.choices[0].message.content)
        return chatResponse.choices[0].message.content
    } catch (error) {
        return error   
    }
    
}



export default anylyseResumeWithLLm




