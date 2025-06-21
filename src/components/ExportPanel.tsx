import React, { useState } from 'react';
import { Download, FileText, File, Loader2 } from 'lucide-react';
import { ExportManager } from '../utils/exportUtils';
import { Resume } from '../types/resume';

interface ExportPanelProps {
  resume: Resume;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ resume }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'docx' | null>(null);
  
  const exportManager = new ExportManager();

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      setExportType('pdf');
      await exportManager.exportToPDF('resume-preview', `${resume.personalInfo.fullName || 'resume'}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      setExportType('docx');
      await exportManager.exportToDocx(resume, `${resume.personalInfo.fullName || 'resume'}.docx`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export DOCX. Please try again.');
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Export Resume</h3>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Download your resume in professional formats, optimized for ATS systems and hiring managers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting && exportType === 'pdf' ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-red-600" />
            )}
            <div className="text-left">
              <div className="font-medium text-gray-800">Export as PDF</div>
              <div className="text-sm text-gray-600">Best for online applications</div>
            </div>
          </button>

          <button
            onClick={handleExportDocx}
            disabled={isExporting}
            className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting && exportType === 'docx' ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <File className="w-5 h-5 text-blue-600" />
            )}
            <div className="text-left">
              <div className="font-medium text-gray-800">Export as DOCX</div>
              <div className="text-sm text-gray-600">Editable Word document</div>
            </div>
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Export Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• PDF format is recommended for most job applications</li>
            <li>• DOCX allows for easy editing and customization</li>
            <li>• Both formats are ATS-friendly and maintain proper formatting</li>
            <li>• Review your resume before submitting to ensure accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};