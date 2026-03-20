import { Mistral } from '@mistralai/mistralai';
const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';


const promptBuilder = (data) => {
    return  `You are an advanced ATS (Applicant Tracking System) resume analyzer.

            Your task is to analyze a candidate's resume and return a structured ATS evaluation report.

            ## INPUT:
            You will receive:

            1. Resume Content (RAW TEXT) → REQUIRED
            2. Target Job Role → OPTIONAL
            3. Job Description → OPTIONAL
            4. Years of Experience → OPTIONAL
            5. Industry/Sector → OPTIONAL

            If optional inputs are missing, infer intelligently from the resume.

            ---

            ## ANALYSIS REQUIREMENTS:

            ### 1. ATS SCORE (0–100)
            Calculate overall ATS compatibility based on:
            - Keyword relevance
            - Formatting
            - Experience quality
            - Skills match
            - Education

            Also provide:
            - status: "Excellent" (85+), "Good" (70–84), "Needs Improvement" (<70)

            ---

            ### 2. CATEGORY SCORES (0–100)
            Return scores for:
            - Keywords
            - Formatting
            - Experience
            - Education
            - Skills Match

            ---

            ### 3. ACTION ITEMS (IMPORTANT)
            Generate actionable feedback grouped by severity:

            Each item must include:
            - title
            - description
            - severity ("Critical", "Important", "Tip")

            Examples:
            - Missing Professional Summary
            - Lack of quantified achievements
            - Weak action verbs
            - Missing LinkedIn
            - Poor formatting
            - Keyword gaps

            Minimum 5–12 action items.

            ---

            ### 4. KEYWORD ANALYSIS

            #### a) Keywords Present
            Extract relevant keywords found in resume.

            #### b) Missing High-Priority Keywords
            Based on:
            - Job description (if provided)
            - Otherwise inferred role

            Examples:
            - Technologies
            - Tools
            - Concepts

            #### c) Partially Mentioned Keywords
            Keywords that appear but are weakly represented.

            ---

            ### 5. IMPROVEMENT SUGGESTIONS
            Provide:
            - Bullet-level rewrite suggestions
            - Example improvements (quantified statements)

            ---

            ### 6. SUMMARY INSIGHT
            Give a short 2–3 line summary explaining:
            - Strength of resume
            - Main gap

            ---

            ## OUTPUT FORMAT (STRICT JSON):

            Return ONLY valid JSON (no explanation text):

            {
            "ats_score": {
                "score": 70,
                "status": "Needs Improvement"
            },
            "category_scores": {
                "keywords": 58,
                "formatting": 82,
                "experience": 75,
                "education": 90,
                "skills_match": 65
            },
            "action_items": [
                {
                "title": "Missing Professional Summary",
                "description": "Resume lacks a 3–4 line summary at the top which is critical for ATS ranking.",
                "severity": "Critical"
                }
            ],
            "keyword_analysis": {
                "present": ["Python", "Machine Learning", "AWS"],
                "missing": ["MLOps", "Kubernetes", "CI/CD", "TensorFlow"],
                "partial": ["System Design", "Scalability"]
            },
            "improvement_suggestions": [
                "Replace 'worked on API' with 'Developed REST APIs handling 10K+ requests/day'",
                "Add metrics to achievements"
            ],
            "summary": "The resume shows strong technical skills but lacks keyword optimization and measurable achievements."
            }

            ---

            ## RULES:
            - Be strict like a real ATS
            - Prefer measurable insights
            - Do NOT hallucinate experience
            - Infer role intelligently if missing
            - Keep output clean and structured
            
            ---
            input data is here 
            Resume:
            ${data.resumeData}

            Target Role: ${data.target_role || "Not provided"}
            Job Description: ${data.job_description || "Not provided"}
            Experience: ${data.experience_level || "Not provided"}
            Sector: ${data.sector || "Not provided"}

        `
}

const anylyseResumeWithLLm = async (data) => {
    try {
        const client = new Mistral({apiKey: apiKey});
        const prompt = promptBuilder(data);
        const chatResponse = await client.chat.complete({
            model: 'mistral-medium-latest',
            messages: [{role: 'user', content: prompt}],
        });

        // console.log(chatResponse.choices[0].message.content)
        return chatResponse.choices[0].message.content
    } catch (error) {
        return error   
    }
    
}



export default anylyseResumeWithLLm




