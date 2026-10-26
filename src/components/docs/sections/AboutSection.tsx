import { docMeta, anchor } from "../meta";
import { A, B, DocSection, DocSubsection, DocTable, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.about;

// Rows of the "How to use it" table: what the reader wants, and where to go
const readerPaths: [string, string][] = [
    ["Understand what the tool does", docMeta.features.title],
    ["See how it is built", docMeta.built.title],
    ["Know where the information comes from", docMeta.collection.title],
    ["Understand a country’s classification", docMeta.indicators.title],
    ["Understand how an answer is produced", docMeta.analysis.title],
    ["Decide how far to rely on the results", docMeta.verification.title],
    ["Run your own copy", docMeta.run.title],
    ["Change or extend the tool", docMeta.extend.title],
];

export function AboutSection() {
    return (
        <DocSection title={title}>
            <DocSubsection title={parts.purpose}>
                <P>
                    This documentation explains the Policy Analyzer as a whole, so that readers can judge what it can
                    tell them, how far to trust it, and how to reuse it. It describes the tool’s features, design, data
                    and method. It does not report policy findings; the tool itself does that.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.audience}>
                <UL>
                    <LI>
                        <B>Researchers and policy analysts</B> who use the tool to compare how countries regulate
                        personal data and run digital identity systems. They need to know where the information comes
                        from and what its limits are.
                    </LI>
                    <LI>
                        <B>Implementers and advisers</B> working on data protection or digital identity, who want a
                        quick, sourced view of a country or a comparison between countries.
                    </LI>
                    <LI>
                        <B>Developers and research teams</B> who want to run their own copy, connect their own AI
                        provider, or adapt the tool to another topic or region.
                    </LI>
                    <LI>
                        <B>Partners and reviewers</B> who want to understand how the tool was built and checked.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.usage}>
                <DocTable
                    head={["If you want to...", "Read"]}
                    rows={readerPaths.map(([goal, target]) => [goal, <A key={target} href={anchor(target)}>{target}</A>])}
                />
            </DocSubsection>

            <DocSubsection title={parts.takeaway}>
                <P>After reading this page you should be able to:</P>
                <UL>
                    <LI>describe what the Policy Analyzer does and what it does not do;</LI>
                    <LI>
                        explain how a country classification and an answer to a question are produced, and what
                        evidence they rest on;
                    </LI>
                    <LI>judge how far to rely on the results, and what to check before you use them;</LI>
                    <LI>run your own instance, connect it to your own AI provider, and extend it.</LI>
                </UL>
            </DocSubsection>
        </DocSection>
    );
}
