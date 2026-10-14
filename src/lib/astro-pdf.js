import { jsPDF } from "jspdf";

const BRAND_BG = [247, 240, 228];
const BRAND = [146, 84, 34];
const INK = [60, 50, 40];

function drawHeader(doc, subtitle) {
    doc.setFillColor(...BRAND_BG);
    doc.rect(0, 0, 210, 32, "F");
    doc.setFont("times", "bold");
    doc.setTextColor(...BRAND);
    doc.setFontSize(20);
    doc.text("VASTUGRAH", 105, 14, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(subtitle, 105, 25, { align: "center" });
}

function sectionTitle(doc, y, text) {
    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...BRAND);
    doc.text(text, 14, y);
    doc.setDrawColor(200, 180, 150);
    doc.line(14, y + 2, 196, y + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    return y + 10;
}

function footer(doc) {
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text("For spiritual guidance. Consult a qualified astrologer for important decisions.", 105, 292, { align: "center" });
}

export function downloadKundliPdf(chart) {
    const doc = new jsPDF();
    drawHeader(doc, "Janam Kundli — Birth Chart");
    let y = 44;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(`Name: ${chart.name || "-"}    Gender: ${chart.gender || "-"}`, 14, y);
    doc.text(`Birth: ${chart.date || "-"} at ${chart.time || "-"}    Place: ${chart.place || "-"}`, 14, y + 6);
    y += 18;

    y = sectionTitle(doc, y, "Key Details");
    [
        ["Ascendant (Lagna)", chart.ascendant],
        ["Moon Sign (Rashi)", chart.moon_sign],
        ["Sun Sign", chart.sun_sign],
        ["Nakshatra", chart.nakshatra ? `${chart.nakshatra}${chart.nakshatra_pada ? ` (Pada ${chart.nakshatra_pada})` : ""}` : ""],
        ["Nakshatra Lord", chart.nakshatra_lord],
        ["Current Mahadasha", chart.current_mahadasha],
    ].forEach(([k, v]) => {
        if (!v) return;
        doc.text(`${k}:`, 14, y);
        doc.text(String(v), 62, y);
        y += 6;
    });
    y += 6;

    y = sectionTitle(doc, y, "Planetary Positions (Sidereal / Lahiri)");
    doc.setFont("helvetica", "bold");
    doc.text("Planet", 14, y);
    doc.text("Sign", 55, y);
    doc.text("Degree", 100, y);
    doc.text("Nakshatra", 125, y);
    doc.text("Retro", 182, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    (chart.planets || []).forEach((p) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(String(p.planet || "-"), 14, y);
        doc.text(String(p.sign || "-"), 55, y);
        doc.text(p.degree != null ? String(p.degree) : "-", 100, y);
        doc.text(String(p.nakshatra || "-"), 125, y);
        doc.text(p.retrograde ? "R" : "-", 182, y);
        y += 6;
    });

    if (chart.dashas && chart.dashas.length) {
        y += 6;
        y = sectionTitle(doc, y, "Vimshottari Mahadashas");
        chart.dashas.forEach((d) => {
            if (y > 280) { doc.addPage(); y = 20; }
            doc.text(`${d.lord}:  ${d.start} - ${d.end}`, 14, y);
            y += 6;
        });
    }

    footer(doc);
    doc.save(`Kundli-${String(chart.name || "chart").replace(/\s+/g, "-")}.pdf`);
}

export function downloadRudrakshaPdf(rec, profile) {
    const doc = new jsPDF();
    drawHeader(doc, "Your Personal Rudraksha Recommendation");
    let y = 46;

    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...BRAND);
    doc.text(`${rec.mukhi} Rudraksha`, 14, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(`Moon Sign: ${rec.moonSign}    Ruling Deity: ${rec.deity}    Ruling Planet: ${rec.planet}`, 14, y + 10);
    y += 22;

    y = sectionTitle(doc, y, "Spiritual Benefits");
    doc.setFont("helvetica", "normal");
    rec.benefits.forEach((b) => {
        const lines = doc.splitTextToSize(b, 176);
        doc.circle(17, y - 3, 1, "F");
        lines.forEach((line) => {
            doc.text(line, 24, y);
            y += 6;
        });
        y += 2;
    });

    y = sectionTitle(doc, y + 4, "How to Wear");
    doc.setFont("helvetica", "normal");
    doc.text(doc.splitTextToSize(rec.wearing, 176), 14, y);
    y += 12;

    y = sectionTitle(doc, y, "Energising Mantra");
    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.text(rec.mantra, 14, y);

    if (profile) {
        y += 14;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Prepared for: ${profile.name || "-"}  ·  Moon Sign ${rec.moonSign}`, 14, y);
    }

    footer(doc);
    doc.save(`Rudraksha-${rec.mukhi.replace(/\s+/g, "-")}.pdf`);
}