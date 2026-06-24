// Türkçe (Roboto gömülü) jsPDF örneği üretir. Tüm araçların ortak PDF temeli.
export async function yeniPdf() {
  const { jsPDF } = await import("jspdf");
  const { ROBOTO_REGULAR_B64 } = await import("./roboto");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.addFileToVFS("Roboto-Regular.ttf", ROBOTO_REGULAR_B64);
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  doc.setFont("Roboto");
  return doc;
}

export const tl = (n: number) =>
  n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " TL";
