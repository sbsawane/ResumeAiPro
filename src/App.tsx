import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, Download, Sparkles } from 'lucide-react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
import { ATSAnalysisPanel } from './components/ATSAnalysisPanel';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { ExportPanel } from './components/ExportPanel';
import { Resume, JobDescription, ATSAnalysis } from './types/resume';
import { ATSAnalyzer } from './utils/atsAnalyzer';

const initialResume: Resume = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  customSections: []
};

function App() {
  const [resume, setResume] = useState<Resume>(initialResume);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  const analyzer = new ATSAnalyzer();

  const handleAnalyzeResume = async (jobDescription: JobDescription) => {
    setIsAnalyzing(true);
    
    // Simulate API call delay for better UX
    setTimeout(() => {
      const analysis = analyzer.analyzeResume(resume, jobDescription);
      setAtsAnalysis(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(resume));
  }, [resume]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('resume-data');
    if (saved) {
      try {
        const parsedResume = JSON.parse(saved);
        setResume(parsedResume);
      } catch (error) {
        console.error('Failed to load saved resume:', error);
      }
    }
  }, []);

  const tabs = [
    { id: 'editor', title: 'Resume Builder', icon: FileText },
    { id: 'analysis', title: 'ATS Analysis', icon: BarChart3 },
    { id: 'export', title: 'Export', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ResumeAI Pro</h1>
                <p className="text-sm text-gray-600">ATS-Optimized Resume Builder</p>
              </div>
            </div>
            
            {atsAnalysis && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">ATS Score</div>
                  <div className={`text-lg font-bold ${
                    atsAnalysis.score >= 80 ? 'text-green-600' : 
                    atsAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {atsAnalysis.score}/100
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ResumeForm resume={resume} onUpdate={setResume} />
            </div>
            <div className="lg:sticky lg:top-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Preview</h3>
                <div className="transform scale-75 origin-top">
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <JobDescriptionInput onAnalyze={handleAnalyzeResume} isAnalyzing={isAnalyzing} />
            </div>
            <div>
              <ATSAnalysisPanel analysis={atsAnalysis} isAnalyzing={isAnalyzing} />
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ExportPanel resume={resume} />
            </div>
            <div className="lg:sticky lg:top-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Preview</h3>
                <div className="transform scale-75 origin-top">
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;