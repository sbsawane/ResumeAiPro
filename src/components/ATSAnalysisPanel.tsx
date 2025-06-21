import React from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { ATSAnalysis } from '../types/resume';

interface ATSAnalysisPanelProps {
  analysis: ATSAnalysis | null;
  isAnalyzing: boolean;
}

export const ATSAnalysisPanel: React.FC<ATSAnalysisPanelProps> = ({ analysis, isAnalyzing }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-3 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Analyzing your resume...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">ATS Analysis</h3>
          <p className="text-gray-600 mb-4">
            Paste a job description to get an ATS compatibility score and optimization suggestions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* ATS Score */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreBgColor(analysis.score)} mb-4`}>
          <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">ATS Compatibility Score</h3>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(analysis.score)}`}
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      {/* Analysis Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">{analysis.analysis.keywordDensity.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Keyword Match</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">{analysis.analysis.formatScore}</div>
          <div className="text-sm text-gray-600">Format Score</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">{analysis.analysis.lengthScore}</div>
          <div className="text-sm text-gray-600">Length Score</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-semibold text-gray-800">{analysis.analysis.readabilityScore}</div>
          <div className="text-sm text-gray-600">Readability</div>
        </div>
      </div>

      {/* Matched Keywords */}
      {analysis.matchedKeywords.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-800">Matched Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.matchedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {analysis.missingKeywords.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-800">Missing Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800 border border-orange-200"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Optimization Suggestions</h4>
          </div>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};