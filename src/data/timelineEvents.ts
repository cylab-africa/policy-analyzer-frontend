export interface TimelineEvent {
    year: number;
    content: string;
    type?: string;
    countries?: string[];
}

// When the events were last reviewed. Update this whenever an event is added or changed.
export const TIMELINE_LAST_UPDATED = "October 2026";

// Data protection milestones, newest first.
// Malabo Convention entries follow the African Union's official status list (ratifications are dated by the
// year the instrument was deposited). National laws are from the dataprotection.africa country fact sheets,
// the Seychelles Official Gazette. Burundi: MoFo privacy library; DR Congo's 27 June 2025 deposit: OSIRIS (citing
// CIO Mag); AU Data Policy Framework: African Union / Power Law Africa. Re-check against the AU treaty status list.
export const dataProtectionEvents: TimelineEvent[] = [
    {
        year: 2026,
        content:
            "Burundi enacts its data protection law (Law n° 1/03 of 10 March 2026), after parliament adopted the bill in January.",
        type: "national-law",
        countries: ["Burundi"],
    },
    {
        year: 2025,
        content:
            "The Democratic Republic of the Congo deposits its instrument of ratification of the Malabo Convention with the African Union on 27 June, the 17th country to ratify.",
        type: "ratification",
        countries: ["DR Congo"],
    },
    {
        year: 2025,
        content:
            "Djibouti and The Gambia are reported to have enacted data protection laws: Djibouti within its Digital Code, and The Gambia through the Personal Data Protection and Privacy Act.",
        type: "national-law",
        countries: ["Djibouti", "The Gambia"],
    },
    {
        year: 2024,
        content:
            "Ethiopia (Proclamation 1321/2024), Malawi (Data Protection Act), Cameroon (Law 2024/017, December) and the Central African Republic (Loi 24/001, January) enact data protection laws.",
        type: "national-law",
        countries: ["Ethiopia", "Malawi", "Cameroon", "Central African Republic"],
    },
    {
        year: 2024,
        content:
            "São Tomé & Príncipe deposits its instrument of ratification of the Malabo Convention on 15 February, the 16th country to ratify.",
        type: "ratification",
        countries: ["São Tomé & Príncipe"],
    },
    {
        year: 2024,
        content: "Nigeria signs the Malabo Convention on 23 January but has not yet ratified it.",
        type: "signing",
        countries: ["Nigeria"],
    },
    {
        year: 2023,
        content:
            "Nigeria (Data Protection Act, signed 14 June), Somalia (Data Protection Act, March) and Seychelles (Data Protection Act, in force 22 December) enact data protection laws.",
        type: "national-law",
        countries: ["Nigeria", "Somalia", "Seychelles"],
    },
    {
        year: 2023,
        content: "Sudan, South Africa, Djibouti and Lesotho sign the Malabo Convention but do not ratify it.",
        type: "signing",
        countries: ["Sudan", "South Africa", "Djibouti", "Lesotho"],
    },
    {
        year: 2023,
        content: "Malabo Convention enters into force on 8 June, following the 15th ratification.",
        type: "entry-force",
    },
    {
        year: 2023,
        content: "Côte d'Ivoire and Mauritania ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Côte d'Ivoire", "Mauritania"],
    },
    {
        year: 2022,
        content:
            "The African Union Executive Council endorses the AU Data Policy Framework in February, which recommends that member states adopt data protection laws backed by functioning authorities and ratify the Malabo Convention.",
        type: "policy",
    },
    {
        year: 2022,
        content:
            "Tanzania (Personal Information Protection Act, passed November) and Eswatini (Data Protection Act, published March) enact data protection laws.",
        type: "national-law",
        countries: ["Tanzania", "Eswatini"],
    },
    {
        year: 2022,
        content: "Cabo Verde and Niger ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Cabo Verde", "Niger"],
    },
    {
        year: 2022,
        content: "The Gambia signs the Malabo Convention on 2 December.",
        type: "signing",
        countries: ["The Gambia"],
    },
    {
        year: 2021,
        content:
            "Rwanda (Law No. 058/2021, October), Zambia (Data Protection Act No. 3 of 2021) and Zimbabwe (Data Protection Act) enact data protection laws.",
        type: "national-law",
        countries: ["Rwanda", "Zambia", "Zimbabwe"],
    },
    {
        year: 2021,
        content: "Togo and Zambia ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Togo", "Zambia"],
    },
    {
        year: 2020,
        content: "Angola, Republic of Congo and Mozambique ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Angola", "Republic of Congo", "Mozambique"],
    },
    {
        year: 2019,
        content: "Ghana, Namibia and Rwanda ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Ghana", "Namibia", "Rwanda"],
    },
    {
        year: 2019,
        content:
            "Uganda (Data Protection and Privacy Act, passed 3 March) and Kenya (Data Protection Act, November) enact data protection laws.",
        type: "national-law",
        countries: ["Uganda", "Kenya"],
    },
    {
        year: 2018,
        content: "Mauritius and Guinea ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Mauritius", "Guinea"],
    },
    {
        year: 2016,
        content: "Senegal becomes the first country to ratify the Malabo Convention.",
        type: "ratification",
        countries: ["Senegal"],
    },
    {
        year: 2014,
        content:
            "The African Union adopts the Convention on Cyber Security and Personal Data Protection (the Malabo Convention) in June.",
        type: "adoption",
    },
    {
        year: 2011,
        content:
            "The African Union begins drafting the Convention, with a first draft prepared at the 17th AU Summit in Malabo.",
        type: "drafting",
    },
];

// Digital identity milestones, newest first.
// Sources: Biometric Update (Ethiopia, Namibia, The Gambia), allAfrica (Liberia, Togo, Mali, Rwanda), Nairametrics
// (Nigeria), news reports and official statements for Niger, Somalia, Uganda, Kenya and Mauritius, the World Bank
// press release of 5 June 2018 (WURI), and Ghana's NIA and Senegal's launch coverage. Recent figures are as
// reported on the dates given; re-check them before relying on them.
export const digitalIdEvents: TimelineEvent[] = [
    {
        year: 2026,
        content:
            "Togo's e-ID programme has registered more than 6 million of the country's roughly 8 million people by late September, and nearly all registrants hold a digital card. Only the Kara region remains to be covered.",
        type: "enrollment-milestone",
        countries: ["Togo"],
    },
    {
        year: 2026,
        content:
            "Namibia sets September for the launch of its electronic ID card, after postponing it so that data protection and identity legislation could be finalised.",
        type: "project-rollout",
        countries: ["Namibia"],
    },
    {
        year: 2026,
        content: "Liberia selects an Austrian firm to deliver a new biometric ID system, in August.",
        type: "project-update",
        countries: ["Liberia"],
    },
    {
        year: 2026,
        content:
            "The Gambia launches a new national identification system, with registration beginning in the Greater Banjul area in August.",
        type: "project-launch",
        countries: ["The Gambia"],
    },
    {
        year: 2026,
        content:
            "Ethiopia's Fayda ID has about 52.8 million people registered by July, up from 24 million in June 2025. Safaricom Ethiopia joins the programme to run enrolment in seven regions.",
        type: "enrollment-milestone",
        countries: ["Ethiopia"],
    },
    {
        year: 2026,
        content:
            "Nigeria's NIN enrolment reaches 136 million in July, up from 123.9 million in October 2025, and a new NIMC Act repeals and replaces the 2007 law governing the commission.",
        type: "enrollment-milestone",
        countries: ["Nigeria"],
    },
    {
        year: 2026,
        content:
            "Niger formally launches its biometric national ID card, branded the AES card, in Niamey on 27 March, starting with a pilot phase in the capital.",
        type: "project-launch",
        countries: ["Niger"],
    },
    {
        year: 2026,
        content:
            "Somalia's national ID authority (NIRA) opens an ID registration office at its embassy in Nairobi, its 30th office abroad.",
        type: "project-rollout",
        countries: ["Somalia"],
    },
    {
        year: 2025,
        content:
            "Rwanda begins biometric enrolment for its new digital ID, following a 2023 law. More than 300,000 people had registered by 20 November, and residents are due to be able to use the digital ID from June 2026.",
        type: "project-rollout",
        countries: ["Rwanda"],
    },
    {
        year: 2025,
        content:
            "Uganda launches a nationwide mass enrolment and renewal of national ID cards on 27 May, across all 146 districts, aiming to renew about 15.8 million cards and register 17.2 million new people.",
        type: "enrollment-milestone",
        countries: ["Uganda"],
    },
    {
        year: 2025,
        content:
            "Sierra Leone's National Civil Registration Authority reports 93% national ID registration coverage (self-reported).",
        type: "enrollment-milestone",
        countries: ["Sierra Leone"],
    },
    {
        year: 2024,
        content:
            "Mauritius unveils its new national ID card on 26 February, a chip card built by a Thales-led consortium under a 10-year contract, with a companion digital ID wallet app.",
        type: "project-launch",
        countries: ["Mauritius"],
    },
    {
        year: 2024,
        content:
            "Kenya's Maisha Namba digital ID rollout resumes after the High Court lifts a freeze on 12 August.",
        type: "project-update",
        countries: ["Kenya"],
    },
    {
        year: 2023,
        content:
            "The Malabo Convention on cybersecurity and data protection enters into force on June 8, providing a foundational legal framework for digital ID initiatives.",
        type: "legal-framework",
    },
    {
        year: 2023,
        content:
            "Mali begins handing over its new secure biometric national ID cards in April, starting in Bamako.",
        type: "project-rollout",
        countries: ["Mali"],
    },
    {
        year: 2022,
        content: "Ethiopia launches the Fayda national ID, beginning with a pilot phase ahead of a wider rollout.",
        type: "enrollment-launch",
        countries: ["Ethiopia"],
    },
    {
        year: 2020,
        content:
            "The African Union adopts its Digital Transformation Strategy for Africa (2020-2030), highlighting digital ID as a crucial enabler for development.",
        type: "policy-adoption",
    },
    {
        year: 2018,
        content:
            "The World Bank approves the West Africa Unique Identification for Regional Integration and Inclusion (WURI) program on 5 June, starting with Côte d'Ivoire and Guinea, with Benin, Burkina Faso and Niger to follow.",
        type: "program-launch",
        countries: ["Côte d'Ivoire", "Guinea"],
    },
    {
        year: 2018,
        content: "Public registration for the Ghana Card begins in the Greater Accra region on 28 May.",
        type: "project-launch",
        countries: ["Ghana"],
    },
    {
        year: 2017,
        content: "Ghana unveils the Ghana Card and relaunches its National Identification System in September.",
        type: "project-launch",
        countries: ["Ghana"],
    },
    {
        year: 2016,
        content:
            "Senegal becomes the first ECOWAS country to issue the ECOWAS biometric identity card, on 4 October.",
        type: "regional-project-launch",
        countries: ["Senegal"],
    },
    {
        year: 2014,
        content:
            "ECOWAS heads of state approve a regional biometric identity card (ENBIC) to facilitate mobility across the region.",
        type: "regional-policy",
    },
];
