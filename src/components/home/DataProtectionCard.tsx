import { LEGISLATION_STATUS_LABELS, MALABO_STATUS_LABELS, isYear, labelFor } from "@/lib/status-labels";
import type { PolicyLaw } from "@/types/api";
import { CardHeader, CardLinks, CardRow } from "./MapPopover";

export default function DataProtectionCard({
    country,
    pinned,
    statusColor,
    malaboColor,
}: {
    readonly country: PolicyLaw;
    readonly pinned: boolean;
    readonly statusColor: string;
    readonly malaboColor: string;
}) {
    return (
        <>
            <CardHeader
                flag={country.flagEmoji}
                name={country.country}
                status={labelFor(LEGISLATION_STATUS_LABELS, country.dataProtectionLegislationStatus)}
                color={statusColor}
            />
            <div className="space-y-3 p-4">
                {isYear(country.yearLegislationEnacted) && (
                    <CardRow label="Year enacted">{country.yearLegislationEnacted}</CardRow>
                )}
                <CardRow label="Malabo Convention">
                    <span style={{ color: malaboColor }}>
                        {labelFor(MALABO_STATUS_LABELS, country.malaboConventionStatus)}
                    </span>
                </CardRow>
                <CardLinks links={country.links ?? []} pinned={pinned} />
            </div>
        </>
    );
}
