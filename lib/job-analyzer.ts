/**
 * Job Analyzer
 * Analyzes job requirements and maps them to skills
 */

export interface SkillGap {
  skill: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsToAcquire: number;
  learningResources: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface CareerGapAnalysis {
  targetRole: string;
  currentProfile: {
    skills: string[];
    experience: string;
    education: string;
  };
  skillGaps: SkillGap[];
  readinessScore: number; // 0-100
  estimatedPreparationTime: number; // in weeks
  developmentPlan: string;
  recommendedCertifications: string[];
}

/**
 * Analyze skill gaps between current profile and target role
 */
export function analyzeSkillGaps(
  currentSkills: string[],
  targetSkills: string[],
  experience: number
): SkillGap[] {
  const gaps: SkillGap[] = [];

  // High-demand skills for tech roles
  const skillDifficulty: { [key: string]: number } = {
    // Easy skills (2-4 weeks to acquire basics)
    Git: 2,
    Docker: 3,
    'REST APIs': 3,
    Testing: 3,
    Linux: 4,

    // Medium skills (1-3 months)
    React: 6,
    'Node.js': 6,
    Python: 8,
    'SQL Databases': 8,
    Kubernetes: 10,

    // Hard skills (3-6 months)
    'System Design': 16,
    'Machine Learning': 20,
    'AWS/Cloud': 12,
    Microservices: 12,

    // Expert skills (6+ months)
    'ML Ops': 24,
    'Distributed Systems': 24,
  };

  targetSkills.forEach((skill) => {
    if (!currentSkills.includes(skill)) {
      const weeks = skillDifficulty[skill] || 8;
      const proficiency = weeks <= 4 ? 'beginner' : weeks <= 12 ? 'intermediate' : 'advanced';
      const priority = weeks <= 4 ? 'low' : weeks <= 8 ? 'medium' : weeks <= 16 ? 'high' : 'critical';

      gaps.push({
        skill,
        proficiency,
        yearsToAcquire: weeks / 4,
        learningResources: getResourcesForSkill(skill),
        priority,
      });
    }
  });

  return gaps.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Get learning resources for a specific skill
 */
function getResourcesForSkill(skill: string): string[] {
  const resources: { [key: string]: string[] } = {
    React: [
      'React Official Documentation',
      'freeCodeCamp React Course',
      'React Patterns and Best Practices',
    ],
    'Node.js': ['Node.js Official Docs', 'The Node.js Way', 'Express.js Tutorial'],
    Python: ['Python.org Docs', 'Real Python', 'Automate the Boring Stuff'],
    'System Design': [
      'System Design Interview by Alex Xu',
      'Designing Data-Intensive Applications',
      'LeetCode System Design',
    ],
    'Machine Learning': [
      'Fast.ai Course',
      'Andrew Ng ML Specialization',
      'Kaggle Courses',
      'TensorFlow Docs',
    ],
    AWS: ['AWS Free Tier', 'AWS Certified Solutions Architect', 'A Cloud Guru'],
    Docker: ['Docker Official Tutorial', 'Play with Docker', 'Docker Mastery Course'],
    Kubernetes: [
      'Kubernetes Documentation',
      'Kubernetes for Developers',
      'Linux Academy Kubernetes',
    ],
    'SQL Databases': [
      'SQL Tutorial W3Schools',
      'Mode Analytics SQL Tutorial',
      'Database Design Fundamentals',
    ],
    Git: ['Git Official Documentation', 'GitHub Learning Lab', 'Atlassian Git Tutorials'],
    Testing: ['Testing Library Docs', 'Jest Docs', 'The Testing Trophy'],
    Microservices: [
      'Building Microservices by Sam Newman',
      'Microservices Patterns',
      'Microservices.io',
    ],
    Linux: [
      'Linux Command Line Basics',
      'Linux Academy',
      'Linux from Scratch',
      'LPIC Certification',
    ],
    'REST APIs': [
      'REST API Tutorial',
      'API Design Best Practices',
      'OpenAPI/Swagger Docs',
    ],
  };

  return resources[skill] || ['Search "[skill] tutorial" on YouTube', 'Check Udemy courses'];
}

/**
 * Calculate readiness score
 */
export function calculateReadinessScore(
  currentSkills: string[],
  targetSkills: string[],
  yearsExperience: number
): number {
  // Base: matching skills
  const skillMatchRatio = currentSkills.filter((s) => targetSkills.includes(s)).length / targetSkills.length;
  let score = skillMatchRatio * 60;

  // Experience boost
  if (yearsExperience >= 3) score += 20;
  else if (yearsExperience >= 1) score += 10;

  // Additional soft skills (assumed)
  score += 20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Generate career development plan
 */
export function generateCareerPlan(
  currentProfile: { skills: string[]; experience: string; education: string },
  targetRole: string,
  targetSkills: string[]
): CareerGapAnalysis {
  const skillGaps = analyzeSkillGaps(currentProfile.skills, targetSkills, 3);
  const readinessScore = calculateReadinessScore(
    currentProfile.skills,
    targetSkills,
    parseInt(currentProfile.experience) || 3
  );

  // Estimate preparation time
  const totalWeeks = skillGaps.reduce((sum, gap) => sum + gap.yearsToAcquire * 4, 0);
  const estimatedPreparationTime = Math.ceil(totalWeeks / 4);

  // Generate plan
  let plan = `
📚 CAREER DEVELOPMENT PLAN
============================

🎯 Target Role: ${targetRole}

📊 CURRENT PROFILE
  Skills: ${currentProfile.skills.join(', ')}
  Experience: ${currentProfile.experience}
  Education: ${currentProfile.education}

🎯 READINESS SCORE: ${readinessScore}%
  ${readinessScore >= 80 ? '✅ Ready for role' : readinessScore >= 60 ? '⚠️ Needs preparation' : '❌ Significant gaps'}

⏱️ ESTIMATED PREPARATION TIME: ${estimatedPreparationTime} weeks

📋 SKILL GAPS (Priority Order)
`;

  skillGaps.forEach((gap, i) => {
    plan += `
${i + 1}. ${gap.skill} [${gap.priority.toUpperCase()}]
   Current: None → Target: ${gap.proficiency}
   Time to Acquire: ${gap.yearsToAcquire.toFixed(1)} years (${Math.ceil(gap.yearsToAcquire * 4)} weeks)
   
   Resources:
${gap.learningResources.slice(0, 2).map((r) => `   • ${r}`).join('\n')}
`;
  });

  // Recommended certifications
  const certifications = getRecommendedCertifications(targetRole, targetSkills);
  plan += `
🏆 RECOMMENDED CERTIFICATIONS
${certifications.map((c) => `• ${c}`).join('\n')}

📅 12-WEEK LEARNING ROADMAP
Week 1-3: Foundation Building
  Focus: ${skillGaps.slice(0, 2).map((s) => s.skill).join(', ')}
  Activities: Complete online courses, start personal projects

Week 4-8: Skill Development
  Focus: Deepen knowledge, build portfolio projects
  Activities: Contribute to open source, complete 2-3 projects

Week 9-11: Interview Preparation
  Focus: Practice technical and behavioral questions
  Activities: Mock interviews, system design practice

Week 12: Final Preparation
  Focus: Polish portfolio, practice common questions
  Activities: Final mock interviews, company research

✅ SUCCESS METRICS
• Portfolio with 3+ relevant projects
• Practice interview score: 80%+
• Technical assessment: Pass
• Behavioral interview: STAR method mastery
`;

  return {
    targetRole,
    currentProfile,
    skillGaps,
    readinessScore,
    estimatedPreparationTime,
    developmentPlan: plan,
    recommendedCertifications: certifications,
  };
}

/**
 * Get recommended certifications for target role
 */
function getRecommendedCertifications(role: string, skills: string[]): string[] {
  const certs: { [key: string]: string[] } = {
    'Senior Software Engineer': [
      'AWS Certified Solutions Architect',
      'Kubernetes Application Developer',
    ],
    'Data Scientist': ['Google Cloud Professional Data Engineer', 'Coursera ML Specialization'],
    'DevOps Engineer': [
      'AWS Certified DevOps Engineer',
      'Certified Kubernetes Administrator',
      'HashiCorp Certified: Terraform Associate',
    ],
    'Full Stack Developer': ['Full Stack Web Developer Bootcamp Certificate'],
    'Solutions Architect': [
      'AWS Certified Solutions Architect - Professional',
      'Azure Solutions Architect',
    ],
    'Machine Learning Engineer': [
      'Google Cloud Professional ML Engineer',
      'TensorFlow Developer Certificate',
      'DataCamp ML Engineer Track',
    ],
  };

  return certs[role] || ['Check industry-standard certifications for your target role'];
}

/**
 * Generate detailed interview preparation guide based on job analysis
 */
export function generateRoleSpecificInterview(targetRole: string, skills: string[]): string {
  let guide = `
🎤 ROLE-SPECIFIC INTERVIEW GUIDE
==================================

Role: ${targetRole}
Required Skills: ${skills.join(', ')}

📖 COMPANY & ROLE RESEARCH CHECKLIST
• Company mission and values
• Recent projects and innovations
• Competitor analysis
• Industry trends
• Role-specific growth opportunities

💡 KEY TALKING POINTS FOR ${targetRole.toUpperCase()}
`;

  // Role-specific talking points
  const talkingPoints: { [key: string]: string[] } = {
    'Senior Engineer': [
      'Mentorship and team development',
      'System design and architecture',
      'Code review and quality standards',
      'Technical decision making',
      'Cross-functional collaboration',
    ],
    'Data Scientist': [
      'ML model development and deployment',
      'Statistical analysis',
      'Data visualization',
      'Business impact measurement',
      'A/B testing and experimentation',
    ],
    'DevOps Engineer': [
      'Infrastructure automation',
      'CI/CD pipeline optimization',
      'Monitoring and observability',
      'Disaster recovery',
      'Cost optimization',
    ],
    'Full Stack Developer': [
      'End-to-end feature development',
      'Performance optimization',
      'User experience improvements',
      'Responsive design',
      'API design and implementation',
    ],
  };

  const points = talkingPoints[targetRole] || ['Technical expertise', 'Problem solving', 'Collaboration'];
  points.forEach((p) => {
    guide += `\n✓ ${p}`;
  });

  guide += `

📝 BEHAVIORAL QUESTIONS TO PREPARE
1. "Tell me about your most challenging project"
   → Highlight: Problem-solving, perseverance, results

2. "Describe a time you led a technical initiative"
   → Highlight: Leadership, communication, impact

3. "How do you approach learning new technologies?"
   → Highlight: Growth mindset, initiative, passion

4. "Tell me about a disagreement with a colleague"
   → Highlight: Communication, compromise, professionalism

5. "What's your career goal and how does this role fit?"
   → Highlight: Ambition, alignment, growth potential

🎯 QUESTIONS TO ASK INTERVIEWER
1. "What does success look like in this role after 6 months?"
2. "How does the team approach code reviews and quality?"
3. "What are the biggest technical challenges the team faces?"
4. "How do you support professional development and growth?"
5. "What is the company culture like, and how does this team embody it?"

💰 SALARY NEGOTIATION GUIDE
• Research market rate: $${Math.random() > 0.5 ? '120' : '150'}k - $${Math.random() > 0.5 ? '150' : '180'}k
• Factor in: Experience, skills, location, company size
• Negotiation strategy:
  1. Wait for company to offer first
  2. Research thoroughly
  3. Counter with justified range
  4. Consider total compensation (benefits, equity, etc.)
  5. Be willing to walk if needed

✅ DAY-BEFORE CHECKLIST
□ Review company and role information
□ Practice explaining your top 3 projects
□ Prepare STAR examples
□ Get quality sleep
□ Plan your commute / test video setup
□ Pick professional outfit
□ Gather copies of portfolio/certifications

🎬 DURING INTERVIEW
• Arrive 10 minutes early
• Make eye contact and smile
• Listen carefully before answering
• Use specific examples
• Ask thoughtful questions
• Thank them at the end
• Follow up within 24 hours
`;

  return guide;
}

export default {
  analyzeSkillGaps,
  calculateReadinessScore,
  generateCareerPlan,
  generateRoleSpecificInterview,
};
