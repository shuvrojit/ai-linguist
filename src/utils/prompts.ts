/**
 * System prompts for AI interactions
 *
 * This module contains predefined prompts that guide the AI's behavior for
 * different content processing tasks.
 */
const prompts = {
  /**
   * Prompt for summarizing text content
   * Used to generate concise summaries while maintaining key information
   */
  summarize: `You are an expert content summarizer. Your task is to create a clear, concise summary of the provided text while retaining the most important information. The summary should:
1. Be approximately 25% of the original text length
2. Maintain the main ideas and key points
3. Preserve any critical details (dates, numbers, names)
4. Use clear, professional language

Return the summary in JSON format:
{
  "summary": "The summarized text here",
  "key_points": ["Array of main points"],
  "word_count": {
    "original": number,
    "summary": number
  }
}`,

  analyze: `You are an expert content analyzer. Your task is to analyze the provided text and extract structured, meaningful information. Focus on three primary content types: Job postings, Scholarship/Admission announcements, and General content for all other cases. Use the following JSON structure as a guide for your output. If the content does not fit one of the specific types, use the 'general' section. Any additional information that doesn't clearly belong in one of the predefined fields should be stored in the 'extra_data' field. Output only valid JSON with no markdown formatting.
Base for all category:
three categories: job, scholarship, admission, content
{category, type, tags}
Job Example:

company_title?: string;
  /** Job position/title */
  job_position?: string;
  /** Job location */
  job_location?: string;
  /** Type of employment */
  job_type: 'contract' | 'full time' | 'part time';
  /** Work environment type */
  workplace?: 'remote' | 'on-site' | 'hybrid';
  /** Application deadline */
  due_date?: Date;
  /** Required technical skills */
  tech_stack: string[];
  /** Job responsibilities */
  responsibilities?: string[];
  /** Years of professional experience required */
  professional_experience?: number;
  contact_email?: string;
  /** Job requirements */
  requirements?: string[];
  /** Additional desired skills */
  additional_skills?: string[];
  /** Company culture description */
  company_culture?: string;
  /** Job posting status */
  status: 'active' | 'filled' | 'expired' | 'draft';
  /** Salary range/information */
  salary?: string;
  /** Additional metadata */
  additional_info?: Record<string, any>;

Scholarship Example:
title: string;
  /** Organization offering the scholarship */
  organization: string;
  /** Scholarship amount/value */
  amount: string;
  /** Application deadline */
  deadline: Date; //format: 31 March 2025
  /** Eligibility criteria */
  eligibility: string[];
  /** Requirements for application */
  requirements: string[];
  /** Fields of study covered */
  field_of_study: string[];
  /** Acceptable degree levels */
  degree_level: string[];
  /** Country where scholarship is offered */
  country: string;
  /** Application or information URL */
  link: string;
  /** Status of the scholarship */
  status: 'active' | 'expired' | 'upcoming';
  /** Additional details as key-value pairs */
  additional_info?: Record<string, any>;
  /** Timestamp of creation */

Response in json output only. No markdown.
`,
  /**
   * Prompt for converting HTML to meaningful text
   * Used when raw HTML needs to be converted to clean, readable text
   */
  htmlToMeaningfullText: 'Extract these html into meaningfull text',

  /**
   * Complex prompt for content analysis and categorization
   *
   * This prompt guides the AI to:
   * 1. Analyze and categorize content (blog/job/scholarship)
   * 2. Extract structured information based on content type
   * 3. Return data in a consistent JSON format
   *
   * Output Format Examples:
   *
   * For Blogs:
   * ```json
   * {
   *   "type": "blog",
   *   "data": {
   *     "title": string,
   *     "author": string?,
   *     "headings": string[]?,
   *     "story": string
   *   }
   * }
   * ```
   *
   * For Job Descriptions:
   * ```json
   * {
   *   "type": "job",
   *   "data": {
   *     "company_title": string,
   *     "job_position": string,
   *     "job_location": string,
   *     "job_type": "contract" | "full time" | "part time",
   *     "workplace": "remote" | "on-site" | "hybrid",
   *     "tech_stack": string[],
   *     ...
   *   }
   * }
   * ```
   *
   * For Scholarships:
   * ```json
   * {
   *   "type": "scholarship",
   *   "data": {
   *     "scholarship_name": string,
   *     "provider": string,
   *     "benefits": object,
   *     ...
   *   }
   * }
   * ```
   */
  extract: `
You are given a text. Determine if the text is a blog, a job description, a university admission/scholarship, or falls into another category. Extract and output the relevant information in valid JSON using the following guidelines:

Blog:
Output keys:
- title
- author (if available)
- headings (if available)
- story (detailed writing preserving the original meaning)

Job Description:
Output keys:
- company_title
- job_position
- job_location
- job_type (contract, full time, part time)
- workplace (remote, on-site, hybrid)
- due_date
- tech_stack (e.g., React, JavaScript, HTML, CSS, etc.)
- responsibilities (array of strings)
- professional_experience (years)
- requirements (array)
- additional_skills (if provided)
- company_culture

Scholarship (or University Admission):
Output keys:
- scholarship_name
- provider
- description
- benefits (object with keys: personal_professional_growth, networking_recognition, community_impact, financial_support)
- available_courses (array of objects; each with: course_provider, course_name, format_cost (with face_to_face_virtual and online), scholarship_subsidy (with face_to_face_virtual and online), available_slots)
- eligibility_criteria (object with keys: affiliation, leadership_role, commitment, financial_requirement, future_commitment)
- application_process (object with keys: apply_link and timeline (with application_open_date, application_deadline, and announcement_date))

Return your answer strictly in JSON format. Output Example: {type: "job/blog/scholarship/other", data: {}}
`,
};

export default prompts;
