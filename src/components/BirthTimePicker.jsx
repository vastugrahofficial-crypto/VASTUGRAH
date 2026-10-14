import React from "react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

// Friendly time-of-birth picker: hour + minute selects with an AM/PM toggle.
// Stores a 24h "HH:MM" string, same format the Kundli form used before.
export default function BirthTimePicker({ value, onChange, disabled }) {
    let h = 6;
    let m = "00";
    let ampm = "AM";
    if (value && /^\d{2}:\d{2}$/.test(value)) {
        const [H, M] = value.split(":").map(Number);
        ampm = H >= 12 ? "PM" : "AM";
        h = H % 12 || 12;
        m = String(M).padStart(2, "0");
    }

    const set = (nh, nm, na) => {
        const H = na === "PM" ? (nh === 12 ? 12 : nh + 12) : nh === 12 ? 0 : nh;
        onChange(`${String(H).padStart(2, "0")}:${nm}`);
    };

    const selCls =
        "rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-60";

    return (
        <div className="flex items-center gap-2">
            <select value={h} disabled={disabled} onChange={(e) => set(Number(e.target.value), m, ampm)} className={selCls}>
                {HOURS.map((x) => (
                    <option key={x} value={x}>{x} hr</option>
                ))}
            </select>
            <select value={m} disabled={disabled} onChange={(e) => set(h, e.target.value, ampm)} className={selCls}>
                {MINUTES.map((x) => (
                    <option key={x} value={x}>{x} min</option>
                ))}
            </select>
            <div className="flex flex-1 overflow-hidden rounded-lg border border-border">
                {["AM", "PM"].map((p) => (
                    <button
                        type="button"
                        key={p}
                        disabled={disabled}
                        onClick={() => set(h, m, p)}
                        className={`flex-1 px-3 py-3 text-sm font-medium transition-colors disabled:opacity-60 ${ampm === p ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-primary"
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    );
}