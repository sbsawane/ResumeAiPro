import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { Resume } from '../types/resume';

export class ExportManager {
  async exportToPDF(elementId: string, filename: string = 'resume.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume element not found');
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export PDF');
    }
  }

  async exportToDocx(resume: Resume, filename: string = 'resume.docx'): Promise<void> {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header with name
            new Paragraph({
              text: resume.personalInfo.fullName,
              heading: HeadingLevel.TITLE,
              spacing: { after: 200 }
            }),
            
            // Contact information
            new Paragraph({
              children: [
                new TextRun(`${resume.personalInfo.email} | ${resume.personalInfo.phone}`),
              ],
              spacing: { after: 200 }
            }),
            
            new Paragraph({
              children: [
                new TextRun(`${resume.personalInfo.location}`),
              ],
              spacing: { after: 400 }
            }),

            // Professional Summary
            new Paragraph({
              text: "Professional Summary",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 }
            }),
            
            new Paragraph({
              text: resume.personalInfo.summary,
              spacing: { after: 400 }
            }),

            // Experience
            new Paragraph({
              text: "Experience",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 }
            }),

            ...resume.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({ text: exp.position, bold: true }),
                  new TextRun(` | ${exp.company}`),
                ],
                spacing: { after: 100 }
              }),
              new Paragraph({
                text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                spacing: { after: 200 }
              }),
              ...exp.description.map(desc => 
                new Paragraph({
                  text: `• ${desc}`,
                  spacing: { after: 100 }
                })
              ),
              new Paragraph({ text: "", spacing: { after: 200 } })
            ]),

            // Education
            new Paragraph({
              text: "Education",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 }
            }),

            ...resume.education.map(edu => 
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true }),
                  new TextRun(` in ${edu.field} | ${edu.institution}`),
                ],
                spacing: { after: 200 }
              })
            ),

            // Skills
            new Paragraph({
              text: "Skills",
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 200, after: 200 }
            }),

            new Paragraph({
              text: resume.skills.map(skill => skill.name).join(', '),
              spacing: { after: 200 }
            })
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, filename);
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
      throw new Error('Failed to export DOCX');
    }
  }
}