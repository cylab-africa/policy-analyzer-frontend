import { docMeta } from "../meta";
import { B, DocSection, DocSubsection, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.analysis;

export function AnalysisSection() {
    return (
        <DocSection title={title}>
            <P>
                Questions are answered by finding the relevant evidence first and then writing an answer from that
                evidence. The answer is not drawn from the general knowledge of an AI model alone. This approach is
                often called <em>retrieval-augmented generation</em>.
            </P>

            <DocSubsection title={parts.framing}>
                <UL>
                    <LI>
                        <B>Context.</B> A follow-up question that refers back to the conversation, such as “What
                        penalties does it set?”, is rewritten into a complete question using the last few messages.
                    </LI>
                    <LI>
                        <B>Scope.</B> Questions are checked against the analyser’s scope: data protection and privacy
                        law, digital identity systems, personal data governance, consent and user rights, biometrics,
                        and related cybersecurity regulation in the African context. Questions that are clearly
                        off-topic are declined with an explanation of what is covered.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.locating}>
                <UL>
                    <LI>
                        <B>Topic and country focus.</B> The analysis is limited to the selected topic area and to any
                        African countries the question names.
                    </LI>
                    <LI>
                        <B>Selecting passages.</B> The passages closest in meaning to the question are selected:
                        usually a handful, and more for comparisons and questions that involve counting.
                    </LI>
                    <LI>
                        <B>Comparisons.</B> Comparative questions gather evidence for each country named, so that every
                        country is represented.
                    </LI>
                    <LI>
                        <B>Widening the search.</B> If no evidence is found for a named country, the search widens to
                        the whole topic. If there is still nothing, it widens to the whole collection.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.supplementary}>
                <P>
                    If very little evidence is found, or the question asks about recent or current developments, the
                    analysis also runs a web search. Answers that use web results are instructed to include a note
                    saying so.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.writing}>
                <P>The answer is written from the evidence collected. It follows these rules:</P>
                <UL>
                    <LI>Base the answer on the evidence, and say when information is not available rather than guess.</LI>
                    <LI>Cite specific laws and documents where possible.</LI>
                    <LI>Focus on African countries and their own legal frameworks.</LI>
                    <LI>Keep legal definitions precise rather than paraphrasing them.</LI>
                    <LI>
                        Reply in the language the question was asked in. When a source is in another language, quote
                        the legal text in its original language with a translation.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.batch}>
                <P>
                    Batch analysis applies the same method to a list of up to 100 questions supplied as a spreadsheet,
                    and compiles the answers into a PDF report. Because every question is phrased once and asked the
                    same way, batch analysis suits systematic comparisons, such as running the same set of questions
                    for several countries or repeating it over time.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
