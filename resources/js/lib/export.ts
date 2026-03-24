import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Alat pembuat file CSV dari data array object
 * 
 * @param data - Array data yang akan di-export
 * @param filename - Nama file output
 * @param headers - Konfigurasi header (label untuk tampilan, key untuk ambil data)
 */
export const exportToCSV = (
    data: any[], 
    filename: string, 
    headers: { label: string; key: string }[]
) => {
    const csvContent = [
        headers.map((h) => h.label).join(","),
        ...data.map((row) => 
            headers.map((h) => {
                const val = row[h.key];
                // Handle special case for strings with commas
                if (typeof val === 'string' && val.includes(',')) {
                    return `"${val}"`;
                }
                return val;
            }).join(",")
        ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Alat pembuat file PDF dari data array object
 * 
 * @param data - Array data yang akan di-export
 * @param filename - Nama file output
 * @param title - Judul laporan di dalam PDF
 * @param headers - Konfigurasi header (label untuk tampilan, key untuk ambil data)
 * @param formatValue - Fungsi opsional untuk format nilai (misal mata uang)
 */
export const exportToPDF = (
    data: any[], 
    filename: string, 
    title: string, 
    headers: { label: string; key: string }[],
    formatValue?: (key: string, value: any) => string
) => {
    const doc = new jsPDF();
    
    // Header PDF
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);
    
    const tableHeaders = [headers.map((h) => h.label)];
    const tableData = data.map((row) => 
        headers.map((h) => {
            const val = row[h.key];
            if (formatValue) {
                return formatValue(h.key, val);
            }
            return val;
        })
    );

    autoTable(doc, {
        head: tableHeaders,
        body: tableData,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [51, 65, 85], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save(`${filename}.pdf`);
};
