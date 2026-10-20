export const getRegion = (countryName: string): string => {
    const eastAfrica = [
        "Burundi",
        "Comoros",
        "Djibouti",
        "Eritrea",
        "Ethiopia",
        "Kenya",
        "Madagascar",
        "Mauritius",
        "Rwanda",
        "Seychelles",
        "Somalia",
        "South Sudan",
        "Tanzania",
        "Uganda",
    ];
    const centralAfrica = [
        "Angola",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Republic of the Congo",
        "Republic of Congo",
        "Democratic Republic of the Congo",
        "Democratic Republic of Congo",
        "Equatorial Guinea",
        "Gabon",
        "São Tomé and Príncipe",
        "Sao Tome and Principe",
        "Sao Tome & Principe",
    ];
    const southernAfrica = [
        "Botswana",
        "Eswatini",
        "Lesotho",
        "Malawi",
        "Mozambique",
        "Namibia",
        "South Africa",
        "Zambia",
        "Zimbabwe",
    ];
    const westAfrica = [
        "Benin",
        "Burkina Faso",
        "Cape Verde",
        "Cabo Verde",
        "Côte d'Ivoire",
        "Ivory Coast",
        "Cote d'Ivoire",
        "Gambia",
        "The Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Liberia",
        "Mali",
        "Mauritania",
        "Niger",
        "Nigeria",
        "Senegal",
        "Sierra Leone",
        "Togo",
    ];
    const northAfrica = ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia"];

    if (northAfrica.includes(countryName)) return "North Africa";
    if (westAfrica.includes(countryName)) return "West Africa";
    if (eastAfrica.includes(countryName)) return "East Africa";
    if (centralAfrica.includes(countryName)) return "Central Africa";
    if (southernAfrica.includes(countryName)) return "Southern Africa";
    return "Other";
};

export const getDocumentLanguage = (countryName: string): string => {
    const francophoneCountries = [
        "Benin",
        "Burkina Faso",
        "Burundi",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Congo",
        "Republic of Congo",
        "Democratic Republic of the Congo",
        "Democratic Republic of Congo",
        "Djibouti",
        "Gabon",
        "Guinea",
        "Ivory Coast",
        "Cote d'Ivoire",
        "Madagascar",
        "Mali",
        "Niger",
        "Rwanda",
        "Senegal",
        "Seychelles",
        "Togo",
    ];
    const arabicCountries = ["Algeria", "Egypt", "Libya", "Mauritania", "Morocco", "Sudan", "Tunisia"];
    const portugueseCountries = [
        "Angola",
        "Cape Verde",
        "Cabo Verde",
        "Guinea-Bissau",
        "Mozambique",
        "São Tomé and Príncipe",
        "Sao Tome and Principe",
        "Sao Tome & Principe",
    ];

    if (francophoneCountries.includes(countryName)) return "French";
    if (arabicCountries.includes(countryName)) return "Arabic/French";
    if (portugueseCountries.includes(countryName)) return "Portuguese";
    return "English";
};

// Country code to emoji mapping
export const FLAG_EMOJIS: Record<string, string> = {
    DZ: "🇩🇿",
    AO: "🇦🇴",
    BJ: "🇧🇯",
    BW: "🇧🇼",
    BF: "🇧🇫",
    BI: "🇧🇮",
    CM: "🇨🇲",
    CV: "🇨🇻",
    CF: "🇨🇫",
    TD: "🇹🇩",
    KM: "🇰🇲",
    CG: "🇨🇬",
    CD: "🇨🇩",
    CI: "🇨🇮",
    DJ: "🇩🇯",
    EG: "🇪🇬",
    GQ: "🇬🇶",
    ER: "🇪🇷",
    SZ: "🇸🇿",
    ET: "🇪🇹",
    GA: "🇬🇦",
    GM: "🇬🇲",
    GH: "🇬🇭",
    GN: "🇬🇳",
    GW: "🇬🇼",
    KE: "🇰🇪",
    LS: "🇱🇸",
    LR: "🇱🇷",
    LY: "🇱🇾",
    MG: "🇲🇬",
    MW: "🇲🇼",
    ML: "🇲🇱",
    MR: "🇲🇷",
    MU: "🇲🇺",
    MA: "🇲🇦",
    MZ: "🇲🇿",
    NA: "🇳🇦",
    NE: "🇳🇪",
    NG: "🇳🇬",
    RW: "🇷🇼",
    ST: "🇸🇹",
    SN: "🇸🇳",
    SC: "🇸🇨",
    SL: "🇸🇱",
    SO: "🇸🇴",
    ZA: "🇿🇦",
    SS: "🇸🇸",
    SD: "🇸🇩",
    TZ: "🇹🇿",
    TG: "🇹🇬",
    TN: "🇹🇳",
    UG: "🇺🇬",
    ZM: "🇿🇲",
    ZW: "🇿🇼",
};

export interface YearBadge {
    text: string;
    /** The full original wording, shown on hover when the badge shortens it */
    title?: string;
}

const PLAIN_YEAR = /^\d{4}$/;
const STARTS_WITH_YEAR = /^(?:19|20)\d{2}\b/;
const YEAR_AFTER_LAUNCH = /\blaunch\w*[^0-9]*((?:19|20)\d{2})\b/i;

/**
 * Label for the year badge on a source card.
 * Data protection records hold the year a law was enacted. Digital ID records hold a free-text
 * launch description. Placeholders (N/A, TBD, empty) produce no badge, never a made-up date.
 */
export const getYearBadge = (type: string, value: string | undefined): YearBadge | null => {
    const text = value?.trim();
    if (!text || /^(n\/a|tbd|unknown|-)$/i.test(text)) return null;

    if (type === "data-protection") {
        return PLAIN_YEAR.test(text) ? { text: `Enacted ${text}` } : null;
    }
    if (PLAIN_YEAR.test(text)) return { text: `Launched ${text}` };
    if (/^planned\b/i.test(text)) return { text, title: text };

    // Use a year only when it is the start date: at the start of the text, or right after "launch"
    const year = STARTS_WITH_YEAR.exec(text)?.[0] ?? YEAR_AFTER_LAUNCH.exec(text)?.[1];
    return year ? { text: `Since ${year}`, title: text } : null;
};

const PUBLISHERS: Record<string, string> = {
    "dataprotection.africa": "Data Protection Africa (ALT Advisory)",
    "blog.africadataprotection.org": "Data Protection Africa (ALT Advisory)",
    "dlapiperdataprotection.com": "DLA Piper",
    "id4d.worldbank.org": "World Bank ID4D",
    "documents.worldbank.org": "the World Bank",
    "documents1.worldbank.org": "the World Bank",
    "ecdpm.org": "ECDPM",
    "gazette.sc": "the Seychelles Official Gazette",
    "nira.gov.so": "Somalia's National Identification and Registration Authority (NIRA)",
};

const LINK_TYPE_LABELS: Record<string, string> = {
    "Academic Research": "Academic research",
    "Policy Research": "Policy research",
    "Research Institute": "Research institute publication",
    "Development Partner": "Development partner publication",
    Government: "Government publication",
    Official: "Official publication",
    News: "News report",
};

const hostOf = (url: string): string => {
    try {
        const host = new URL(url).hostname;
        return host.startsWith("www.") ? host.slice(4) : host;
    } catch {
        return "";
    }
};

/** One line saying what a source link is, from its publisher and type, so each card describes its own resource. */
export const describeLink = (link: { url: string; type?: string }, kind: "data-protection" | "digital-id"): string => {
    const host = hostOf(link.url);
    if (host === "dataprotection.africa") {
        return "Country fact sheet from Data Protection Africa (ALT Advisory), covering the law, the regulator and international commitments.";
    }
    if (host === "dlapiperdataprotection.com") {
        return "Law firm overview from DLA Piper's Data Protection Laws of the World.";
    }

    const isPdf = link.url.toLowerCase().endsWith(".pdf");
    const isLawText = kind === "data-protection" && isPdf;
    const label =
        (isLawText && "Text of the law (PDF)") ||
        (link.type && LINK_TYPE_LABELS[link.type]) ||
        (kind === "data-protection" ? "Legal resource" : "Resource");
    const format = isPdf && !isLawText ? " (PDF)" : "";
    const publisher = PUBLISHERS[host];
    if (publisher) return `${label}${format} from ${publisher}.`;
    return host ? `${label}${format} on ${host}.` : `${label}${format}.`;
};
