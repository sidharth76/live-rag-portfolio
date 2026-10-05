export interface Skill {
  name: string;
  category: 'AI & GenAI' | 'Machine Learning' | 'Data Analytics' | 'APIs & Backend' | 'Languages & Tools';
  level: number; // Percentage 1-100
  iconName: string;
  description: string;
  highlight?: boolean;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: 'RAG & LLM' | 'Machine Learning' | 'Data Analytics' | 'API & Automation';
  tags: string[];
  metrics?: string[];
  architectureOverview?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degreeOrTitle: string;
  institution: string;
  period: string;
  description: string;
  skillsAcquired: string[];
  type: 'education' | 'certification';
  grade?: string;
}
