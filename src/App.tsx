import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, Download, Sparkles, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">ResumeAI Pro</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">ATS-Optimized Resume Builder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {atsAnalysis && (
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-gray-600">ATS Score</div>
                  <div className={`text-lg font-bold ${
                    atsAnalysis.score >= 80 ? 'text-green-600' : 
                    atsAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {atsAnalysis.score}/100
                  </div>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.title}</span>
                </button>
              );
            })}
            {atsAnalysis && (
              <div className="px-3 py-2 border-t border-gray-200 mt-2">
                <div className="text-sm text-gray-600">ATS Score</div>
                <div className={`text-lg font-bold ${
                  atsAnalysis.score >= 80 ? 'text-green-600' : 
                  atsAnalysis.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {atsAnalysis.score}/100
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Tab Navigation */}
      <div className="hidden md:block bg-white border-b border-gray-200">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {activeTab === 'editor' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="space-y-6">
              <ResumeForm resume={resume} onUpdate={setResume} />
            </div>
            <div className="lg:sticky lg:top-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Preview</h3>
                <div className="transform scale-50 sm:scale-75 lg:scale-75 origin-top overflow-hidden">
                  <ResumePreview resume={resume} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="space-y-6">
              <JobDescriptionInput onAnalyze={handleAnalyzeResume} isAnalyzing={isAnalyzing} />
            </div>
            <div>
              <ATSAnalysisPanel analysis={atsAnalysis} isAnalyzing={isAnalyzing} />
            </div>
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <ExportPanel resume={resume} />
            </div>
            <div className="lg:sticky lg:top-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Preview</h3>
                <div className="transform scale-50 sm:scale-75 lg:scale-75 origin-top overflow-hidden">
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