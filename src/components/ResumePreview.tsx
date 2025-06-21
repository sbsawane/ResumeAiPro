import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { Resume } from '../types/resume';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatSkillsByCategory = () => {
    const categories = resume.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof resume.skills>);

    return categories;
  };

  return (
    <div id="resume-preview" className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold mb-2">{resume.personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-4 text-blue-100">
              {resume.personalInfo.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{resume.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-blue-100">
            {resume.personalInfo.linkedin && (
              <div className="flex items-center space-x-1">
                <Linkedin className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </div>
            )}
            {resume.personalInfo.website && (
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Portfolio</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Professional Summary */}
        {resume.personalInfo.summary && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                    </div>
                    <div className="text-gray-600 text-sm mt-1 md:mt-0">
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="text-sm leading-relaxed">{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.field}</p>
                      <p className="text-gray-600">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-gray-600 text-sm mt-1 md:mt-0">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(formatSkillsByCategory()).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
                      >
                        {skill.name}
                        <span className="ml-1 text-xs text-blue-600">({skill.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {resume.customSections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed">
              {section.type === 'list' ? (
                <ul className="list-disc list-inside space-y-1">
                  {section.content.split('\n').map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};