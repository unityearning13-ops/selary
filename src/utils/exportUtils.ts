import html2canvasPro from 'html2canvas-pro';
import html2canvasStd from 'html2canvas';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Resolves an element to export by ID.
 * Falls back gracefully to standard IDs.
 */
function getExportElement(preferredId: string = 'salary-sheet-document-export'): HTMLElement {
  let element = document.getElementById(preferredId);
  if (element && (element.offsetHeight > 10 || element.scrollHeight > 10)) {
    return element;
  }

  // Fallback to standard document ID
  element = document.getElementById('salary-sheet-document');
  if (element && (element.offsetHeight > 10 || element.scrollHeight > 10)) {
    return element;
  }

  // Fallback to ranking element
  element = document.getElementById('ranking-poster-export') || document.getElementById('ranking-poster-view');
  if (element) {
    return element;
  }

  const fallback =
    document.getElementById(preferredId) ||
    document.getElementById('salary-sheet-document-export') ||
    document.getElementById('salary-sheet-document');
  if (fallback) {
    return fallback;
  }

  throw new Error(`Export target element (${preferredId}) not found for export`);
}

/**
 * Normalizes cloned DOM to ensure 100% visible positioning and clean rendering.
 */
function prepareClonedDoc(clonedDoc: Document) {
  // 1. Unhide any export wrappers
  const wrappers = ['official-export-wrapper', 'ranking-export-wrapper'];
  for (const wId of wrappers) {
    const wrapper = clonedDoc.getElementById(wId);
    if (wrapper) {
      wrapper.style.position = 'static';
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.zIndex = '1';
      wrapper.style.opacity = '1';
      wrapper.style.visibility = 'visible';
      wrapper.style.display = 'block';
      wrapper.style.pointerEvents = 'auto';
      wrapper.style.transform = 'none';
    }
  }

  // 2. Normalize target documents and hide scrollbars
  const targetIds = [
    'salary-sheet-document-export',
    'salary-sheet-document',
    'ranking-poster-export',
    'ranking-poster-view',
    'ranking-poster-export-leader',
    'ranking-poster-export-trainer',
    'ranking-poster-export-both',
  ];

  // Global scrollbar hiding for the clone
  if (clonedDoc.body) {
    clonedDoc.body.style.overflow = 'hidden';
    clonedDoc.body.style.scrollbarWidth = 'none'; 
    // msOverflowStyle is handled via the injected style tag below to avoid TS errors
    
    // Inject a style tag to hide scrollbars globally for Webkit
    const style = clonedDoc.createElement('style');
    style.textContent = `
      *::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }
      * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
      body { overflow: hidden !important; overflow-x: hidden !important; overflow-y: hidden !important; }
      html { overflow: hidden !important; }
      .no-scrollbar::-webkit-scrollbar { display: none !important; }
      .overflow-x-auto, .overflow-y-auto, .overflow-auto { -ms-overflow-style: none !important; scrollbar-width: none !important; overflow: visible !important; }
    `;
    clonedDoc.head.appendChild(style);
  }

  for (const tId of targetIds) {
    const target = clonedDoc.getElementById(tId);
    if (target) {
      target.style.position = 'static';
      target.style.left = '0';
      target.style.top = '0';
      target.style.zIndex = '1';
      target.style.opacity = '1';
      target.style.visibility = 'visible';
      target.style.display = 'block';
      target.style.transform = 'none';
      target.style.overflow = 'hidden';
      target.style.scrollbarWidth = 'none';
      
      // Force all table cells to have visible borders in case of collapse issues
      const tables = target.querySelectorAll('table');
      tables.forEach(table => {
        if (table instanceof HTMLElement) {
          table.style.borderCollapse = 'collapse';
        }
      });
    }
  }
}

/**
 * Captures an HTML element into a high-res data URL.
 * Preserves all colors, headers, borders, and typography.
 * Tries html2canvas-pro first, then standard html2canvas, then html-to-image.
 */
export async function captureElement(
  element: HTMLElement,
  format: 'png' | 'jpeg' = 'png',
  scale: number = 2.5
): Promise<{ dataUrl: string; width: number; height: number }> {
  const options = {
    scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.offsetWidth || 1080,
    onclone: (clonedDoc: Document) => {
      prepareClonedDoc(clonedDoc);
    },
  };

  // Primary Renderer: html-to-image (SVG foreignObject - most reliable for modern CSS/Tailwind v4)
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: scale,
      cacheBust: true,
      skipAutoScale: true,
      skipFonts: true,
      fontEmbedCSS: '',
      style: {
        transform: 'none',
        left: '0',
        top: '0',
        position: 'relative',
        visibility: 'visible',
        overflow: 'hidden',
      },
    });

    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });

    if (dimensions.width > 100 && dimensions.height > 100) {
      return {
        dataUrl,
        width: dimensions.width,
        height: dimensions.height,
      };
    }
  } catch (err) {
    console.warn('html-to-image capture issue, attempting html2canvas-pro fallback:', err);
  }

  // Secondary Fallback: html2canvas-pro
  try {
    const canvas = await html2canvasPro(element, options);
    if (canvas && canvas.width > 100 && canvas.height > 100) {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.95;
      return {
        dataUrl: canvas.toDataURL(mimeType, quality),
        width: canvas.width,
        height: canvas.height,
      };
    }
  } catch (err2) {
    console.warn('html2canvas-pro capture issue, attempting standard html2canvas fallback:', err2);
  }

  // Tertiary Fallback: standard html2canvas
  try {
    const canvas = await html2canvasStd(element, options);
    if (canvas && canvas.width > 100 && canvas.height > 100) {
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const quality = format === 'png' ? 1.0 : 0.95;
      return {
        dataUrl: canvas.toDataURL(mimeType, quality),
        width: canvas.width,
        height: canvas.height,
      };
    }
  } catch (err3) {
    console.warn('standard html2canvas capture issue, attempting secondary toPng fallback:', err3);
  }

  // Final fallback: html-to-image with minimal safe options
  const dataUrl = await toPng(element, {
    backgroundColor: '#ffffff',
    pixelRatio: Math.min(scale, 2),
    cacheBust: false,
    skipFonts: true,
    fontEmbedCSS: '',
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

/**
 * Downloads the salary sheet as a high-resolution PNG image with full colors and formatting.
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
 * Downloads the salary sheet as a high-quality PDF document with lossless graphics and crisp text.
 */
export async function downloadSalarySheetPDF(
  elementId: string = 'salary-sheet-document-export',
  filename: string = 'Unity_Earning_Platform_Salary_Sheet.pdf'
): Promise<void> {
  const element = getExportElement(elementId);
  const { dataUrl, width, height } = await captureElement(element, 'png', 2.2);

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
  pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
  heightLeft -= pageHeight - margin * 2;

  // If content is longer than one page, add subsequent pages
  while (heightLeft > 0) {
    position = heightLeft - contentHeight + margin;
    pdf.addPage();
    pdf.addImage(dataUrl, 'PNG', margin, position, contentWidth, contentHeight, undefined, 'FAST');
    heightLeft -= pageHeight - margin * 2;
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

/**
 * Downloads the Ranking Leaderboard poster as a high-resolution PNG image tailored for TikTok / Facebook stories & mobile screens.
 */
export async function downloadRankingPosterImage(
  elementId: string = 'ranking-poster-export',
  filename: string = 'Unity_Earning_Ranking_Leaderboard.png'
): Promise<void> {
  const element = document.getElementById(elementId) || document.getElementById('ranking-poster-view');
  if (!element) {
    throw new Error('Ranking poster element not found for export');
  }

  // 480px width * 2.25 = 1080px, 853.33px height * 2.25 = 1920px (Strict 9:16 Full HD)
  const { dataUrl } = await captureElement(element, 'png', 2.25);

  const link = document.createElement('a');
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads the Ranking Leaderboard poster as a single-page PDF with exact aspect ratio (9:16 or matching mobile frame).
 */
export async function downloadRankingPosterPDF(
  elementId: string = 'ranking-poster-export',
  filename: string = 'Unity_Earning_Ranking_Leaderboard.pdf'
): Promise<void> {
  const element = document.getElementById(elementId) || document.getElementById('ranking-poster-view');
  if (!element) {
    throw new Error('Ranking poster element not found for export');
  }

  const { dataUrl, width, height } = await captureElement(element, 'png', 2.4);

  // Use proportional page size matching the poster aspect ratio for a seamless single page
  const ratio = height / width;
  const pdfWidth = 210; // mm
  const pdfHeight = Math.round(pdfWidth * ratio);

  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}

/**
 * Native print trigger
 */
export function printSalarySheet(): void {
  window.print();
}
