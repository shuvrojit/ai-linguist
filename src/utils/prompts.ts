const prompts = {
  htmlToMeaningfullText: 'Extract these html into meaningfull text',
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

Other:
Output:
- raw_text (the original text)

Return your answer strictly in JSON format.
`,
};

export default prompts;
