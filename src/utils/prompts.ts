/**
 * System prompts for AI interactions
 *
 * This module contains predefined prompts that guide the AI's behavior for
 * different content processing tasks.
 */
const prompts = {
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
