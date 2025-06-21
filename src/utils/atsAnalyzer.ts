import { Resume, JobDescription, ATSAnalysis } from '../types/resume';

export class ATSAnalyzer {
  private commonKeywords = [
    'leadership', 'management', 'communication', 'problem-solving', 'teamwork',
    'project management', 'data analysis', 'customer service', 'strategic planning',
    'budget management', 'cross-functional', 'stakeholder', 'process improvement',
    'quality assurance', 'compliance', 'innovation', 'collaboration'
  ];

  extractKeywords(text: string): string[] {
    const words = text.toLowerCase()
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const phrases = this.extractPhrases(text.toLowerCase());
    return [...new Set([...words, ...phrases])];
  }

  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];
    const commonPhrases = [
      'project management', 'data analysis', 'customer service', 'team leadership',
      'strategic planning', 'budget management', 'process improvement', 'quality assurance',
      'software development', 'machine learning', 'data science', 'digital marketing',
      'social media', 'content marketing', 'sales management', 'business development'
    ];

    commonPhrases.forEach(phrase => {
      if (text.includes(phrase)) {
        phrases.push(phrase);
      }
    });

    return phrases;
  }

  analyzeResume(resume: Resume, jobDescription: JobDescription): ATSAnalysis {
    const resumeText = this.extractResumeText(resume);
    const resumeKeywords = this.extractKeywords(resumeText);
    const jobKeywords = this.extractKeywords(jobDescription.description);
    
    const matchedKeywords = resumeKeywords.filter(keyword => 
      jobKeywords.includes(keyword) || 
      jobKeywords.some(jk => jk.includes(keyword) || keyword.includes(jk))
    );

    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.includes(keyword) && 
      !resumeKeywords.some(rk => rk.includes(keyword) || keyword.includes(rk))
    ).slice(0, 10);

    const score = this.calculateATSScore(resume, jobDescription, matchedKeywords, jobKeywords);
    const suggestions = this.generateSuggestions(resume, missingKeywords, matchedKeywords);

    return {
      score,
      matchedKeywords: matchedKeywords.slice(0, 15),
      missingKeywords,
      suggestions,
      analysis: {
        keywordDensity: (matchedKeywords.length / jobKeywords.length) * 100,
        formatScore: this.calculateFormatScore(resume),
        lengthScore: this.calculateLengthScore(resumeText),
        readabilityScore: this.calculateReadabilityScore(resumeText)
      }
    };
  }

  private extractResumeText(resume: Resume): string {
    const { personalInfo, experience, education, skills, customSections } = resume;
    
    let text = `${personalInfo.fullName} ${personalInfo.summary}`;
    
    experience.forEach(exp => {
      text += ` ${exp.company} ${exp.position} ${exp.description.join(' ')}`;
    });
    
    education.forEach(edu => {
      text += ` ${edu.institution} ${edu.degree} ${edu.field}`;
    });
    
    skills.forEach(skill => {
      text += ` ${skill.name} ${skill.category}`;
    });
    
    customSections.forEach(section => {
      text += ` ${section.title} ${section.content}`;
    });
    
    return text;
  }

  private calculateATSScore(
    resume: Resume, 
    jobDescription: JobDescription, 
    matchedKeywords: string[], 
    jobKeywords: string[]
  ): number {
    const keywordMatch = (matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 100;
    const formatScore = this.calculateFormatScore(resume);
    const lengthScore = this.calculateLengthScore(this.extractResumeText(resume));
    const structureScore = this.calculateStructureScore(resume);
    
    return Math.round((keywordMatch * 0.4 + formatScore * 0.2 + lengthScore * 0.2 + structureScore * 0.2));
  }

  private calculateFormatScore(resume: Resume): number {
    let score = 100;
    
    // Check for essential sections
    if (resume.experience.length === 0) score -= 20;
    if (resume.education.length === 0) score -= 10;
    if (resume.skills.length === 0) score -= 15;
    if (!resume.personalInfo.email) score -= 10;
    if (!resume.personalInfo.phone) score -= 5;
    
    return Math.max(score, 0);
  }

  private calculateLengthScore(text: string): number {
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 200) return 60;
    if (wordCount < 400) return 80;
    if (wordCount < 800) return 100;
    if (wordCount < 1200) return 90;
    return 70;
  }

  private calculateReadabilityScore(text: string): number {
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);
    
    if (avgWordsPerSentence < 15) return 100;
    if (avgWordsPerSentence < 20) return 90;
    if (avgWordsPerSentence < 25) return 80;
    return 70;
  }

  private calculateStructureScore(resume: Resume): number {
    let score = 0;
    
    // Check for proper structure
    if (resume.personalInfo.fullName) score += 10;
    if (resume.personalInfo.summary) score += 15;
    if (resume.experience.length > 0) score += 25;
    if (resume.education.length > 0) score += 20;
    if (resume.skills.length > 0) score += 20;
    
    // Check for dates in experience
    const hasProperDates = resume.experience.every(exp => exp.startDate && (exp.endDate || exp.current));
    if (hasProperDates) score += 10;
    
    return score;
  }

  private generateSuggestions(resume: Resume, missingKeywords: string[], matchedKeywords: string[]): string[] {
    const suggestions: string[] = [];
    
    if (matchedKeywords.length < 5) {
      suggestions.push("Add more relevant keywords from the job description to your resume");
    }
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider adding these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    if (resume.personalInfo.summary.length < 100) {
      suggestions.push("Expand your professional summary to 2-3 sentences");
    }
    
    if (resume.experience.some(exp => exp.description.length < 2)) {
      suggestions.push("Add more bullet points to your work experience descriptions");
    }
    
    if (resume.skills.length < 8) {
      suggestions.push("Add more relevant skills to strengthen your profile");
    }
    
    return suggestions;
  }
}