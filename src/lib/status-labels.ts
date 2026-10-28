// Display names for the status values stored in the country records, shared by the
// Home page maps, tooltips and charts so every view uses the same wording.

export const LEGISLATION_STATUS_LABELS: Record<string, string> = {
    Enacted: "Comprehensive Law",
    Draft: "Draft Legislation",
    Lite: "Limited Framework",
    "No Law": "No Legislation",
};

export const MALABO_STATUS_LABELS: Record<string, string> = {
    Ratified: "Ratified",
    Signed: "Signed",
    No: "Not Signed",
};

export const DIGITAL_ID_STATUS_LABELS: Record<string, string> = {
    Implemented: "Fully Operational",
    Partial: "Partially Implemented",
    Planning: "Planning",
    "No Data": "No Information",
};

export const labelFor = (labels: Record<string, string>, status: string | undefined): string =>
    (status && labels[status]) || status || "";

// The legislation year field also holds placeholders such as "-" and "Draft"
export const isYear = (value: string | undefined): boolean => !!value && /^\d{4}$/.test(value.trim());
