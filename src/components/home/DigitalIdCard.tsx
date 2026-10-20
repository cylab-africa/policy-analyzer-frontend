import { DIGITAL_ID_STATUS_LABELS, labelFor } from "@/lib/status-labels";
import { cn } from "@/lib/utils";
import type { DigitalId } from "@/types/api";
import { CardHeader, CardLinks, CardRow } from "./MapPopover";

const hasValue = (value: string | undefined) => !!value && value !== "N/A";

export default function DigitalIdCard({
    country,
    pinned,
    statusColor,
}: {
    readonly country: DigitalId;
    readonly pinned: boolean;
    readonly statusColor: string;
}) {
    const features = country.features ?? [];

    return (
        <>
            <CardHeader
                flag={country.flagEmoji}
                name={country.country}
                status={labelFor(DIGITAL_ID_STATUS_LABELS, country.status || "No Data")}
                color={statusColor}
            />
            <div className="space-y-3 p-4">
                {hasValue(country.coverage) && <CardRow label="Coverage">{country.coverage}</CardRow>}
                {hasValue(country.year_launched) && <CardRow label="Launched">{country.year_launched}</CardRow>}
                {hasValue(country.authority) && <CardRow label="Authority">{country.authority}</CardRow>}
                {hasValue(country.description) && (
                    <p className={cn("text-sm leading-relaxed text-slate-600", !pinned && "line-clamp-3")}>
                        {country.description}
                    </p>
                )}
                {features.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                        {features.slice(0, pinned ? 8 : 3).map((feature) => (
                            <li
                                key={feature}
                                className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800"
                            >
                                {feature}
                            </li>
                        ))}
                    </ul>
                )}
                <CardLinks links={country.links ?? []} pinned={pinned} />
            </div>
        </>
    );
}
