import { WorkExperience } from '@/types';

export const experienceData: WorkExperience[] = [
  {
    id: 'tcaigv-technologies',
    role: 'Software Engineer',
    company: 'TCAIGV Technologies',
    location: 'Hyderabad, India',
    period: 'Apr 2026 – Present',
    description: [
      'Develop Python-based AI and backend solutions involving document processing, Multimodal RAG pipelines, data analysis, and automation workflows.',
      'Build and integrate AI-enabled functionality with enterprise products (Maintenance Command Center / LightMES) to improve information retrieval and operational workflows.',
      'Work with vector databases (Qdrant), graph databases (Neo4j), LLMs (Ollama, Azure OpenAI), and containerized services (Docker) for scalable AI development.',
      'Debug application issues, analyze system behavior, and collaborate with engineering teams to improve reliability and performance.'
    ],
    technologies: ['Python', 'RAG', 'Ollama', 'Azure OpenAI', 'Qdrant', 'Neo4j', 'LangGraph', 'CrewAI', 'Docker', 'REST APIs']
  },
  {
    id: 'innosn-web-tech',
    role: 'Software Engineer Intern',
    company: 'Innosn Web Technology',
    location: 'Gurugram, India',
    period: 'Jan 2025 – Jun 2025',
    description: [
      'Developed Python and SQL-based backend workflows and assisted with application debugging and feature development.',
      'Supported testing, validation, and optimization of application features and data-processing workflows.',
      'Collaborated with cross-functional team members on code reviews, Git branching, and API endpoint integration.'
    ],
    technologies: ['Python', 'SQL', 'MySQL', 'REST APIs', 'Git', 'Data Processing']
  }
];
