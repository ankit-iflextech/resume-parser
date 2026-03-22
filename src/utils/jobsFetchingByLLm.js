import { Mistral } from '@mistralai/mistralai';
const apiKey = process.env.MISTRAL_API_KEY || 'your_api_key';


const promptBuilder = (data) => {
    return `[INPUT DATA]
Candidate Analysis JSON: ${data}

[INSTRUCTIONS]

Data Processing: Parse the person_details.address, target_role, experience_level, and keyword_analysis (both 'present' and 'missing') from the input.

Job Matching Strategy: >    - Use present keywords to find direct matches.

Use missing keywords and improvement_suggestions to identify "Growth Roles" or roles where the candidate is near-ready.

Adhere strictly to the experience_level constraint (e.g., if the input says "Mid-level but evaluated for 0-2 years", find roles within that specific range).

Dynamic Link Generation: Create functional search URLs for LinkedIn and Indeed using the detected location and job titles.

[OUTPUT FORMAT]
Return ONLY a valid JSON object. No conversational text.

[JSON SCHEMA]
{
  "match_profile": {
    "candidate_name": "string",
    "mapped_sector": "string",
    "focus_location": "string"
  },
  "job_list": [
    {
      "job_title": "string",
      "match_reason": "Based on [Keyword X] and [Experience Y] found in analysis.",
      "estimated_salary": "string",
      "skill_gap_to_close": "Identify one 'missing' keyword from the input that is vital for this role.",
      "search_links": {
        "linkedin": "https://www.linkedin.com/jobs/search/?keywords=[Encoded+Job+Title]&location=[Encoded+Location]",
        "indeed": "https://www.indeed.com/jobs?q=[Encoded+Job+Title]&l=[Encoded+Location]"
      },
      "application_strategy": "One sentence on how to use the 'improvement_suggestions' from the input for this job."
    }
  ]
}
 [STRICT CONSTRAINTS]

Encoding: Replace spaces in URLs with +.

Count: Provide exactly 8 jobs.

Fallback: If address is vague, default [Encoded+Location] to "Remote".

Error Handling: If the input JSON is malformed, return a JSON error object matching your internal INVALID_INPUT_DATA schema.

`

}

export const jobslisting = async (data) => {
    const system_role = `You are a high-performance Recruitment Intelligence Engine. You will receive structured resume analysis data (JSON). Your goal is to map this data, high-probability job roles that bridge the gap between the candidate's current profile and their target sector.`;
    try {
        const client = new Mistral({apiKey: apiKey});
        const prompt = promptBuilder(data);
        const chatResponse = await client.chat.complete({
            model: 'mistral-medium-latest',
            max_tokens: 4000,
            response_format: { type: 'json_object' },
            messages: [{role: 'user', content: prompt}],
        });

        return chatResponse.choices[0].message.content

    } catch (error) {
        return error   
    }
    
}