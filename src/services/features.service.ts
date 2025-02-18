import AIRequest from '../utils/aiRequest';
import { jobDescriptionService } from '.';

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
