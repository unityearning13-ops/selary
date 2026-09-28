import html2canvas from 'html2canvas-pro';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Resolves the salary sheet element to export.
 * Checks for dedicated unscaled export element first, then fallback to document ID.
 */
function getExportElement(preferredId: string = 'salary-sheet-document-export'): HTMLElement {
  // First try the unscaled export container
  let element = document.getElementById(preferredId);
  if (element && element.offsetHeight > 50) {
    return element;
  }

  // Fallback to standard document ID
  element = document.getElementById('salary-sheet-document');
  if (element && element.offsetHeight > 50) {
    return element;
  }

  // If found but height is 0, still return it or throw informative error
  if (element) {
    return element;
  }

  throw new Error('Salary sheet document element not found for export');
}

/**
 * Captures an HTML element into a high-res data URL.
 * Uses html2canvas-pro (with full OKLCH/modern CSS support),
 * with automatic fallback to html-to-image if canvas context fails.
 */
async function captureElement(
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'png',
  scale: number = 2.5
): Promise<{ dataUrl: string; width: number; height: number }> {
  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: Math.max(element.scrollWidth, 1080),
      onclone: (clonedDoc) => {
        const target =
          clonedDoc.getElementById('salary-sheet-document-export') ||
          clonedDoc.getElementById('salary-sheet-document');
        if (target) {
          target.style.transform = 'none';
          target.style.position = 'static';
          target.style.visibility = 'visible';
          target.style.display = 'block';
        }
      },
    });

    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
    const quality = format === 'png' ? 1.0 : 0.95;

    return {
      dataUrl: canvas.toDataURL(mimeType, quality),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (error) {
    console.warn('html2canvas-pro capture encountered an issue, trying html-to-image fallback:', error);

    // Modern browser fallback: html-to-image SVG foreignObject renderer
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: scale,
      cacheBust: true,
    });

    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });

    return {
      dataUrl,
      width: dimensions.width,
      height: dimensions.height,
    };
  }
}

/**
 * Downloads the salary sheet as a high-resolution PNG image.
 */
export async function downloadSalarySheetImage(
  elementId: string = 'salary-sheet-document-export',
  filename: string = 'Unity_Earning_Platform_Salary_Sheet.png'
): Promise<void> {
  const element = getExportElement(elementId);
  const { dataUrl } = await captureElement(element, 'png', 2.5);

  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads the salary sheet as a high-quality PDF document.
 * Automatically handles multi-page splitting if content extends beyond one page.
 */
export async function downloadSalarySheetPDF(
  elementId: string = 'salary-sheet-document-export',
  filename: string = 'Unity_Earning_Platform_Salary_Sheet.pdf'
): Promise<void> {
  const element = getExportElement(elementId);
  const { dataUrl, width, height } = await captureElement(element, 'jpeg', 2.0);

  // Standard A4 dimensions in mm
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 8;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = (height * contentWidth) / width;

  let heightLeft = contentHeight;
  let position = margin;

  // First page
  pdf.addImage(dataUrl, 'JPEG', margin, position, contentWidth, contentHeight);
  heightLeft -= pageHeight - margin * 2;

  // If content is longer than one page, add subsequent pages
  while (heightLeft > 0) {
    position = heightLeft - contentHeight + margin;
    pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', margin, position, contentWidth, contentHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

/**
 * Native print trigger
 */
export function printSalarySheet(): void {
  window.print();
}
