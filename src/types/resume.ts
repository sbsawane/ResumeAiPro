export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  customSections: CustomSection[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'list';
}

export interface ATSAnalysis {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  analysis: {
    keywordDensity: number;
    formatScore: number;
    lengthScore: number;
    readabilityScore: number;
  };
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  keywords: string[];
}