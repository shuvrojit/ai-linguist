/**
 * System prompts for AI interactions
 *
 * This module contains predefined prompts that guide the AI's behavior for
 * different content processing tasks.
 */
const prompts = {
  analyze: `You are an expert content analyzer. Extract meaningful information from the provided content 
  and categorize it appropriately based on its type and content. output only in json format. No markdown.
Analyze the following text and extract structured information. 
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

    Text to analyze: 
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
