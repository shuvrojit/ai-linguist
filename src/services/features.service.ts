import AIRequest from '../utils/aiRequest';
import ApiError from '../utils/ApiError';

export const analyzeContent = async (text: string) => {
  const systemPrompt = `You are an expert content analyzer. Extract meaningful information from the provided content 
  and categorize it appropriately based on its type and content. output only in json format. No markdown.`;

  const userPrompt = `Analyze the following text and extract structured information. 
    Determine the content type (job posting, scholarship/admission, blog article, news, technical documentation, or other) 
    and extract relevant details. Return the result in this format:

    {
      "category": "job|scholarship|blog|news|technical|other",
      "type": "specific type (e.g., job posting, news article, tutorial)",
      "tags": ["relevant", "topic", "tags"],
      "metadata": {
        "title": "content title",
        "author": "author if available",
        "date": "publication/posting date if available",
        "source": "content source if available"
      },
      "details": {
        // For Job Postings:
        "company_info": { name, location, culture },
        "position_details": { title, type, workplace, experience_required },
        "requirements": [ ],
        "responsibilities": [ ],
        "tech_stack": [ ],
        
        // For Scholarships/Admissions:
        "program_info": { name, provider, type },
        "benefits": { financial, academic, other },
        "requirements": { },
        "deadlines": { },
        
        // For Blog/News:
        "summary": "brief summary",
        "key_points": [ ],
        "topics_covered": [ ],
        "target_audience": "intended audience",
        
        // For Technical Content:
        "technology": "main technology/framework",
        "complexity_level": "beginner|intermediate|advanced",
        "code_snippets": [ ],
        "prerequisites": [ ],
        "target_audience": "intended audience"
      },
      "sentiment": "positive|negative|neutral",
      "complexity": "basic|intermediate|advanced",
      "readability_score": 0-100,
      "extra_data": {
        // Any additional information that doesn't fit the above structure
        // This could include custom fields specific to the content
        // For example:
        // - Job: hiring_process, compensation_details, remote_work_policy
        // - Scholarship: selection_process, visa_requirements, special_conditions
        // - Blog: references, related_articles, comment_policy
        // - News: sources, related_stories, fact_check_status
        // - Technical: version_info, system_requirements, license_info
        // - Other: any content-specific details
      }
    }
    
    If there are multiple categories that apply, provide details for each category.
    Important: Store any detected information that doesn't fit into the predefined structure in the extra_data object.

    Output: Only JSON format. No markdown.

    Text to analyze: ${text}
`;

  const response = await AIRequest('gpt-4o', systemPrompt, userPrompt);

  if (!response) {
    throw new ApiError(500, 'No response from AI service');
  }

  try {
    return JSON.parse(response);
  } catch (parseError) {
    throw new ApiError(500, 'Invalid response format from AI service');
  }
};
