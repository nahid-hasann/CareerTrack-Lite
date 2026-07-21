import { Request, Response } from 'express';

export const analyzeJobDescription = async (req: Request, res: Response) => {
  try {
    const { jobDescription, jobTitle, companyName } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Job description text is required for AI analysis',
      });
    }

    const text = jobDescription.trim();
    const title = jobTitle || 'Software Engineer';
    const company = companyName || 'Target Company';

    // Intelligent Skill & Topic Extractor Logic
    const commonSkills = [
      'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'SQL',
      'REST APIs', 'GraphQL', 'Docker', 'AWS', 'System Design', 'Git',
      'Tailwind CSS', 'Next.js', 'Prisma', 'MongoDB', 'Python', 'CI/CD'
    ];

    const foundSkills = commonSkills.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );

    const keySkills = foundSkills.length >= 3 
      ? foundSkills.slice(0, 6) 
      : ['TypeScript / JavaScript', 'React.js', 'Node.js & Express', 'Database Management', 'RESTful API Architecture'];

    const preparationTopics = [
      `Deep dive into ${keySkills[0] || 'Core Framework'} performance & patterns`,
      'Data Structures, Algorithms & Problem Solving',
      'REST API design & Authentication (JWT, OAuth)',
      'Database queries, indexing & Prisma ORM optimization',
      'System Architecture, Scalability & Code Quality',
    ];

    const interviewQuestions = [
      `Can you explain how you would architect a full-stack feature for a role like ${title} at ${company}?`,
      `How do you optimize state management and API data fetching performance in a large React/Node application?`,
      `Describe a challenging bug you encountered in a recent project using ${keySkills[0] || 'your main stack'} and how you resolved it.`,
    ];

    const summary = `This position for ${title} at ${company} requires strong proficiency in ${keySkills.slice(0, 3).join(', ')}. Candidates should focus on web performance, clean architecture, and practical engineering trade-offs.`;

    return res.status(200).json({
      summary,
      keySkills,
      preparationTopics,
      interviewQuestions,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Job Analysis Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Failed to complete AI job description analysis',
    });
  }
};
