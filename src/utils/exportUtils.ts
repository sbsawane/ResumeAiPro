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
      // Create a temporary container for PDF export
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width in pixels at 96 DPI
      tempContainer.style.backgroundColor = 'white';
      document.body.appendChild(tempContainer);

      // Clone the element and adjust for PDF
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.width = '794px';
      clonedElement.style.maxWidth = '794px';
      clonedElement.style.transform = 'none';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '20px';
      clonedElement.style.boxSizing = 'border-box';
      
      // Remove any scaling transforms and adjust font sizes for PDF
      const allElements = clonedElement.querySelectorAll('*');
      allElements.forEach((el: any) => {
        if (el.style) {
          el.style.transform = 'none';
          // Ensure text is readable in PDF
          const computedStyle = window.getComputedStyle(el);
          const fontSize = parseFloat(computedStyle.fontSize);
          if (fontSize < 12) {
            el.style.fontSize = '12px';
          }
        }
      });

      tempContainer.appendChild(clonedElement);

      // Wait for fonts and images to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: clonedElement.scrollHeight
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [794, canvas.height] // Use actual canvas height
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 794, canvas.height);
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
            ...(resume.personalInfo.summary ? [
              new Paragraph({
                text: "Professional Summary",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              
              new Paragraph({
                text: resume.personalInfo.summary,
                spacing: { after: 400 }
              })
            ] : []),

            // Experience
            ...(resume.experience.length > 0 ? [
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
              ])
            ] : []),

            // Education
            ...(resume.education.length > 0 ? [
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
              )
            ] : []),

            // Skills
            ...(resume.skills.length > 0 ? [
              new Paragraph({
                text: "Skills",
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),

              new Paragraph({
                text: resume.skills.map(skill => skill.name).join(', '),
                spacing: { after: 200 }
              })
            ] : [])
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