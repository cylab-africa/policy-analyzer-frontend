import { docMeta, anchor } from "../meta";
import { A, B, DocSection, DocSubsection, DocTable, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.about;

// Rows of the "How to use it" table: what the reader wants, and where to go
const readerPaths: [string, string[]][] = [
    ["Know what the tool does", [docMeta.features.title]],
    ["Understand where the data and the answers come from", [docMeta.collection.title, docMeta.analysis.title]],
    ["Decide how far to rely on the results", [docMeta.verification.title]],
    ["Run or change your own copy", [docMeta.run.title, docMeta.extend.title]],
];

const pathLinks = (titles: string[]) =>
    titles.map((target, index) => (
        <span key={target}>
            {index > 0 && ", "}
            <A href={anchor(target)}>{target}</A>
        </span>
    ));

export function AboutSection() {
    return (
        <DocSection title={title}>
            <DocSubsection title={parts.purpose}>
                <P>
                    This documentation explains the Policy Analyzer as a whole, so that readers can judge what it can
                    tell them, how far to trust it, and how to reuse it. It describes the tool’s features, design, data
                    and method. For findings about a specific country, use the maps, the Sources library or the chat.
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
                    rows={readerPaths.map(([goal, targets]) => [goal, pathLinks(targets)])}
                />
            </DocSubsection>

            <DocSubsection title={parts.takeaway}>
                <P>After reading this page you should be able to:</P>
                <UL>
                    <LI>describe what the Policy Analyzer does and what it does not do;</LI>
                    <LI>
                        explain how a country classification and an answer to a question are produced, and what evidence
                        they rest on;
                    </LI>
                    <LI>judge how far to rely on the results, and what to check before you use them;</LI>
                    <LI>run your own instance, connect it to your own AI provider, and extend it.</LI>
                </UL>
            </DocSubsection>
        </DocSection>
    );
}
