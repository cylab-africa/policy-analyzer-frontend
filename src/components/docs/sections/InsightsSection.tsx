import { docMeta } from "../meta";
import { B, DocSection, LI, UL } from "../primitives";

export function InsightsSection() {
    return (
        <DocSection title={docMeta.insights.title}>
            <UL>
                <LI>
                    <B>Continental statistics.</B> The figures on the Home page count how many countries fall into each
                    indicator category. They are calculated directly from the country records, so they always match the
                    maps.
                </LI>
                <LI>
                    <B>Policy timeline.</B> The timeline on the Home page presents selected milestones in data
                    protection and digital identity across the continent, organised by year. Each entry is taken from a
                    dated source, and figures are as reported on the date given. The date of the last update is shown on
                    the timeline.
                </LI>
                <LI>
                    <B>Document-based findings.</B> Each answer is generated from the chunks retrieved for that
                    question; it is not a stored conclusion. LLM output is not fully predictable, so the same question
                    can be answered differently, and rewording it can retrieve different chunks. Asking questions in a
                    fixed form, as batch analysis does, makes results easier to compare.
                </LI>
            </UL>
        </DocSection>
    );
}
