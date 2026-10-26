import { docMeta } from "../meta";
import { B, DocSection, LI, OL, P } from "../primitives";

export function ExtractionSection() {
    return (
        <DocSection title={docMeta.extraction.title}>
            <P>
                Before a document can be analysed, it is broken down into pieces of evidence that can be found and
                cited:
            </P>
            <OL>
                <LI>
                    <B>Text extraction.</B> The full text is extracted from the original document.
                </LI>
                <LI>
                    <B>Cataloguing.</B> The opening part of the document is read to record the country it concerns, a
                    title and a short description.
                </LI>
                <LI>
                    <B>Topic labelling.</B> Whoever adds the document chooses its topic area: data protection or
                    digital identity, or general when none is chosen.
                </LI>
                <LI>
                    <B>Division into passages.</B> The text is divided into short, overlapping passages of a few
                    paragraphs each. Every passage carries the document’s country and topic labels.
                </LI>
            </OL>
            <P>
                As a result, each piece of evidence is a specific passage of a document rather than the document as a
                whole. It can be found by country and topic, and an analysis can focus on the provisions that matter
                for a question.
            </P>
            <P>
                The country, title and description are detected automatically and are not manually checked, so a
                misreading is possible. If the country cannot be identified, the document is catalogued as “Unknown”.
                Analyses focused on a specific country will not find it, but analyses across the whole topic can.
            </P>
        </DocSection>
    );
}
