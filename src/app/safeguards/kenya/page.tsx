import CountryDossier from "@/components/safeguards/CountryDossier";
import kenyaEvidenceData from "@/data/kenya_principle_evidence.json";
import dpiPrinciplesData from "@/data/dpi_principles.json";
import countryCoverageData from "@/data/country_principle_coverage.json";
import { CountryCoverageData, CountryEvidenceData, DpiPrinciple } from "@/types/api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const evidence = kenyaEvidenceData as CountryEvidenceData;
const principles = dpiPrinciplesData as DpiPrinciple[];
const coverage = countryCoverageData as CountryCoverageData;

export const metadata: Metadata = {
    title: "Kenya — DPI Safeguards Evidence Dossier",
    description:
        "Clause-level legal evidence mapping Kenya's Data Protection Act, 2019 against the UN DPI Safeguards Framework.",
};

export default function KenyaDossierPage() {
    // Hidden from the public until reviewed by a PI.
    notFound();

    const country = coverage.regions
        .flatMap((r) => r.countries)
        .find((c) => c.isoAlpha2 === "KE");

    return <CountryDossier evidence={evidence} principles={principles} country={country ?? null} />;
}
