import AIRequest from '../utils/aiRequest';
import { jobDescriptionService } from '.';
import logger from '../config/logger';

class JobExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JobExtractionError';
  }
}

export const getSummary = async (content: string) => {
  try {
    const response = await AIRequest(
      'gpt-3.5-turbo',
      'Generate a concise summary of the provided content.',
      content
    );
    return response;
  } catch (error) {
    console.error('Error getting summary:', error);
    throw error;
  }
};

export const detailOverview = async (content: string) => {
  try {
    const response = await AIRequest(
      'gpt-3.5-turbo',
      'Provide a detailed overview of the content.',
      content
    );
    return response;
  } catch (error) {
    console.error('Error getting detailed overview:', error);
    throw error;
  }
};

export const extractMeaningfullText = async (text: string) => {
  try {
    const systemPrompt =
      'Extract meaningful text from the provided content. If it appears to be a job posting, structure it according to the specified format.';
    const userPrompt = `Extract meaningful information from this text. If it's a job posting, return it in this format:
    {
      "type": "job",
      "data": {
        "company_title": string,
        "job_position": string,
        "job_location": string,
        "job_type": "contract" | "full time" | "part time",
        "workplace": "remote" | "on-site" | "hybrid",
        "due_date": Date string,
        "tech_stack": string[],
        "responsibilities": string[],
        "professional_experience": number,
        "requirements": string[],
        "additional_skills": string[],
        "company_culture": string
      }
    }
    
    If it's not a job posting, return the text in a meaningful format with type "other".
    
    Text to process: ${text}`;

    const response = await AIRequest('gpt-3.5-turbo', systemPrompt, userPrompt);

    if (!response) {
      throw new JobExtractionError('No response from AI service');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      throw new JobExtractionError('Invalid response format from AI service');
    }

    if (parsedResponse.type === 'job') {
      try {
        const requiredFields = [
          'company_title',
          'job_position',
          'job_location',
          'job_type',
          'workplace',
          'due_date',
          'tech_stack',
          'responsibilities',
          'professional_experience',
          'requirements',
          'company_culture',
        ];

        for (const field of requiredFields) {
          if (!parsedResponse.data[field]) {
            throw new JobExtractionError(`Missing required field: ${field}`);
          }
        }

        parsedResponse.data.due_date = new Date(parsedResponse.data.due_date);
        if (isNaN(parsedResponse.data.due_date.getTime())) {
          throw new JobExtractionError('Invalid due date format');
        }

        const savedJob = await jobDescriptionService.createJob(
          parsedResponse.data
        );
        return { ...parsedResponse, savedJobId: savedJob._id };
      } catch (jobError) {
        if (jobError instanceof JobExtractionError) {
          throw jobError;
        }
        throw new JobExtractionError(
          `Error processing job data: ${(jobError as Error).message}`
        );
      }
    }

    return parsedResponse;
  } catch (error) {
    console.error('Error extracting meaningful text:', error);
    throw error;
  }
};

export const extractMeaning = async (text: string) => {
  try {
    const systemPrompt = `You are an expert content analyzer. Extract meaningful information from the provided content 
    and categorize it appropriately based on its type and content.`;

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
        "prerequisites": [ ]
      },
      "sentiment": "positive|negative|neutral",
      "complexity": "basic|intermediate|advanced",
      "readability_score": 0-100
    }

    Text to analyze: ${text}
    output only json in format. No markdown 
`;

    const response = await AIRequest('gpt-4o', systemPrompt, userPrompt);

    if (!response) {
      throw new Error('No response from AI service');
    }

    console.log(response);
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseError) {
      throw new Error('Invalid response format from AI service');
    }

    return parsedResponse;
  } catch (error) {
    logger.error('Error extracting meaning from text:', error);
    throw error;
  }
};
