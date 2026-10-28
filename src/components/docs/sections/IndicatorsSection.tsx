import { docMeta } from "../meta";
import { B, DocSection, DocSubsection, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.indicators;

export function IndicatorsSection() {
    return (
        <DocSection title={title}>
            <P>
                The country indicators give a consistent basis for comparison. Each country is placed in exactly one
                category for each indicator, so countries can be counted, mapped and compared. The maps cover all 55
                African Union member states. The map data comes from Natural Earth, adapted to show African Union
                members, and is drawn for overview, not as an authoritative boundary reference.
            </P>

            <DocSubsection title={parts.dataProtection}>
                <UL>
                    <LI>
                        <B>Legislation status</B>, in four categories:
                        <UL>
                            <LI>
                                <B>Comprehensive law</B>: a dedicated data protection law has been enacted, whether or
                                not its regulator is operating yet.
                            </LI>
                            <LI>
                                <B>Draft legislation</B>: a data protection bill exists but has not been enacted.
                            </LI>
                            <LI>
                                <B>Limited framework</B>: personal data is addressed only partly, rather than through a
                                dedicated law.
                            </LI>
                            <LI>
                                <B>No legislation</B>: no data protection legislation has been identified.
                            </LI>
                        </UL>
                    </LI>
                    <LI>
                        <B>Year of enactment</B>, where it is known.
                    </LI>
                    <LI>
                        <B>Malabo Convention status</B>: whether the country has ratified, signed or not signed the
                        African Union Convention on Cyber Security and Personal Data Protection (2014).
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.digitalId}>
                <UL>
                    <LI>
                        <B>Implementation status</B>, in four categories: fully operational, partially implemented,
                        planning, or no information. “No information” means we have not found enough published
                        information. It does not mean a country has no ID system.
                    </LI>
                    <LI>
                        <B>Descriptive attributes</B>, where available: the issuing authority, the year the system was
                        launched, a coverage figure, its main features and a short description. The coverage figure
                        estimates how many people the system covers, and it is often reported by the issuing authority
                        itself. It reads “Unknown” or “N/A” where no figure was found, and “Not yet launched” for
                        systems that are still being planned.
                    </LI>
                </UL>
                <P>
                    Categories such as “limited framework” or “partially implemented” involve judgement. A single
                    category cannot capture every nuance of a country’s situation. Country records were last updated in
                    October 2026, and ID programmes in particular change quickly.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
