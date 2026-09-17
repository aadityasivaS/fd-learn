export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdf(filename: string, content: string) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(content, 180);
  pdf.text(lines, 15, 18);
  pdf.save(filename);
}
