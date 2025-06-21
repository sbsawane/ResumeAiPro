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
    <div id="resume-preview" className="bg-white shadow-xl rounded-lg overflow-hidden w-full max-w-4xl mx-auto print:shadow-none print:rounded-none">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 sm:p-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">{resume.personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-blue-100 text-sm">
              {resume.personalInfo.email && (
                <div className="flex items-center space-x-1 min-w-0">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center space-x-1 min-w-0">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center space-x-1 min-w-0">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">{resume.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-blue-100 text-sm">
            {resume.personalInfo.linkedin && (
              <div className="flex items-center space-x-1 min-w-0">
                <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">LinkedIn</span>
              </div>
            )}
            {resume.personalInfo.website && (
              <div className="flex items-center space-x-1 min-w-0">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Portfolio</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* Professional Summary */}
        {resume.personalInfo.summary && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base break-words">{resume.personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience.length > 0 && (
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">{exp.position}</h3>
                        <p className="text-blue-600 font-medium break-words">{exp.company}</p>
                        {exp.location && <p className="text-gray-600 text-sm break-words">{exp.location}</p>}
                      </div>
                      <div className="text-gray-600 text-sm flex-shrink-0">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
                      {exp.description.map((desc, index) => (
                        <li key={index} className="text-sm leading-relaxed break-words">{desc}</li>
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu) => (
                <div key={edu.id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 break-words">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium break-words">{edu.field}</p>
                      <p className="text-gray-600 break-words">{edu.institution}</p>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-gray-600 text-sm flex-shrink-0">
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Skills
            </h2>
            <div className="space-y-4">
              {Object.entries(formatSkillsByCategory()).map(([category, skills]) => (
                <div key={category}>
                  <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-2">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800 border border-blue-200 break-words"
                      >
                        <span className="truncate">{skill.name}</span>
                        <span className="ml-1 text-xs text-blue-600 flex-shrink-0">({skill.level})</span>
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
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1 break-words">
              {section.title}
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {section.type === 'list' ? (
                <ul className="list-disc list-inside space-y-1">
                  {section.content.split('\n').map((item, index) => (
                    <li key={index} className="break-words">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="break-words">{section.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};