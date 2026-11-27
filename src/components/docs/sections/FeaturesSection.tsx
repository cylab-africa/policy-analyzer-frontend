import { docMeta } from "../meta";
import { B, DocSection, LI, P, UL } from "../primitives";

export function FeaturesSection() {
    return (
        <DocSection title={docMeta.features.title}>
            <P>The tool has six parts:</P>
            <UL>
                <LI>
                    <B>Home: continental overview.</B> Two interactive maps of the 55 African Union member states, one
                    for data protection legislation and one for digital identity implementation. Filter a map by status,
                    or click a country to see its details and sources. The page also shows headline statistics and a
                    timeline of key milestones for each topic.
                </LI>
                <LI>
                    <B>Sources.</B> A library of reference documents and research for each country, which you can browse
                    by country and region. Each source has a short description of who published it and what kind of
                    source it is.
                </LI>
                <LI>
                    <B>Chat.</B> Write your question in plain language, in data protection or digital identity mode.
                    Answers are generated with retrieval-augmented generation (RAG) from a collection of policy
                    documents, with web results added when needed. Your list of conversations is saved in your own
                    browser, and the backend server also keeps your questions and answers in its chat history.
                </LI>
                <LI>
                    <B>Document upload.</B> Add a law or policy document, and choose its topic area. It is then ingested
                    and indexed so that it can be retrieved for answers.
                </LI>
                <LI>
                    <B>Batch analysis.</B> Run up to 100 questions at once from a spreadsheet and receive the answers as
                    a PDF report. You can ask to be notified by email when the report is ready.
                </LI>
                <LI>
                    <B>Documentation.</B> This page.
                </LI>
            </UL>

            <P>The tool works at two levels:</P>
            <UL>
                <LI>
                    <B>Country indicators</B>: the same set of indicators is recorded for every country. The maps and
                    statistics let you compare countries by category across the continent, and each country’s card gives
                    the detail.
                </LI>
                <LI>
                    <B>Document analysis</B>: questions are answered from the text of legal and policy documents. Use it
                    for questions the indicators can’t answer, such as what a law requires, what rights it gives, or how
                    two countries’ rules differ.
                </LI>
            </UL>

            <P>
                The analysis covers two topic areas: data protection and digital identity. Documents added without a
                topic are catalogued as general.
            </P>
        </DocSection>
    );
}
