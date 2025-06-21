import React, { useState } from 'react';
import { Briefcase, Loader2 } from 'lucide-react';
import { JobDescription } from '../types/resume';

interface JobDescriptionInputProps {
  onAnalyze: (jobDescription: JobDescription) => void;
  isAnalyzing: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({ onAnalyze, isAnalyzing }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');

  const handleAnalyze = () => {
    if (!description.trim()) return;

    const jobDescription: JobDescription = {
      title: jobTitle || 'Job Title',
      company: company || 'Company',
      description: description.trim(),
      requirements: [],
      keywords: []
    };

    onAnalyze(jobDescription);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    
    // Try to extract job title and company from common formats
    const lines = pastedText.split('\n').filter(line => line.trim());
    if (lines.length > 0 && !jobTitle) {
      setJobTitle(lines[0].trim());
    }
    if (lines.length > 1 && !company) {
      // Look for company name in second line or lines that might contain "at Company"
      const companyLine = lines.find(line => line.toLowerCase().includes('at ')) || lines[1];
      if (companyLine) {
        const companyMatch = companyLine.match(/at\s+(.+)/i);
        if (companyMatch) {
          setCompany(companyMatch[1].trim());
        } else {
          setCompany(companyLine.trim());
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Job Description Analysis</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title (Optional)
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Tech Corp"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={12}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPaste={handlePaste}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the complete job description here...

We're looking for a Senior Software Engineer to join our team. The ideal candidate will have:
• 5+ years of experience in full-stack development
• Proficiency in React, Node.js, and PostgreSQL
• Experience with cloud platforms (AWS, Azure)
• Strong problem-solving and communication skills
..."
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!description.trim() || isAnalyzing}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Resume</span>
            </>
          )}
        </button>

        <div className="text-sm text-gray-600">
          <p className="mb-2">💡 <strong>Pro Tips:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Paste the complete job posting for best results</li>
            <li>Include requirements, responsibilities, and preferred qualifications</li>
            <li>The analyzer will identify key skills and requirements automatically</li>
            <li>Job title and company help with context but aren't required</li>
          </ul>
        </div>
      </div>
    </div>
  );
};