import { AnalysisFlowDiagram } from "../diagrams/AnalysisFlowDiagram";
import { docMeta } from "../meta";
import { B, Code, DocSection, DocSubsection, DocTable, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.analysis;

export function AnalysisSection() {
    return (
        <DocSection title={title}>
            <P>
                Questions are answered with <B>retrieval-augmented generation (RAG)</B>. The tool first{" "}
                <B>retrieves</B> relevant chunks from the document collection, then gives them to a large language model
                (LLM), which <B>generates</B> an answer from them. This reduces reliance on the model’s general
                knowledge, but does not remove it. The steps follow a fixed order set in the code. The tool is not an AI
                agent that decides for itself which steps to take.
            </P>
            <AnalysisFlowDiagram />

            <DocSubsection title={parts.framing}>
                <P>Before searching, the tool works out what is being asked:</P>
                <UL>
                    <LI>
                        <B>Query rewriting.</B> When a follow-up uses words that point back to the conversation, as in
                        “What penalties does it set?”, an LLM uses the recent messages to rewrite it as a complete
                        question.
                    </LI>
                    <LI>
                        <B>Scope guardrail.</B> For questions on public documents, an LLM checks that the question is in
                        scope: data protection and privacy law, digital identity systems, personal data governance,
                        consent and user rights, biometrics, and related cybersecurity regulation in the African
                        context. Off-topic questions are declined with an explanation of what is covered.
                    </LI>
                    <LI>
                        <B>Topic classification.</B> The website sends the topic selected in the chat, and the search
                        is limited to that topic. If a request to the API names no topic, an LLM chooses one. That
                        choice shapes the answer, but the search is then not limited to a topic.
                    </LI>
                    <LI>
                        <B>Entity and intent extraction.</B> An LLM identifies the African countries named in the
                        question, and whether the question asks for a comparison or a count.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.locating}>
                <P>
                    Retrieval uses <B>hybrid search</B>, which combines two ways of searching:
                </P>
                <UL>
                    <LI>
                        <B>Semantic search</B> finds chunks with a similar meaning. It compares the embedding of the
                        question with the chunk embeddings, using a measure called <B>cosine similarity</B>.
                    </LI>
                    <LI>
                        <B>Keyword search</B> finds chunks that share words with the question, using the BM25 sparse
                        vectors.
                    </LI>
                    <LI>
                        <B>Reciprocal Rank Fusion (RRF)</B> merges the two ranked lists, giving priority to chunks that
                        rank highly.
                    </LI>
                </UL>
                <P>
                    <B>Metadata filtering</B> limits the search to the topic sent with the question and to the
                    countries named, with a separate search for each country. The number of chunks requested from each
                    search (the <B>top-k</B>) depends on the type of question. The numbers per search are set in the
                    backend code; the total limit is a default setting (<Code>max_total_docs</Code> in{" "}
                    <Code>config/application.json</Code>).
                </P>
                <DocTable
                    head={["Type of question", "Chunks per search", "Total limit (default)"]}
                    rows={[
                        ["Standard", "Up to 5", "12"],
                        ["Comparison", "Up to 6", "12, or 6 for each named country if that is more"],
                        ["Count", "Up to 30", "12"],
                    ]}
                />
                <P>
                    Repeated chunks are removed. If the filtered searches find nothing, <B>fallback retrieval</B>{" "}
                    searches again without the country filter, and if there is still nothing, without the topic filter.
                    No separate <em>reranking</em> model is applied to the results.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.supplementary}>
                <P>
                    With <B>web search augmentation</B>, web results are added to the retrieved chunks when very few are
                    found, or when the wording of the question points to recent developments. Fixed rules decide this,
                    not the LLM. It works only when a web search service is set up, and it is not used for private
                    documents. Answers that use web results are instructed to say so.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.writing}>
                <P>
                    The LLM receives a <B>prompt</B>: the question, the retrieved chunks, any recent conversation and a
                    set of instructions. With the default settings, it writes the answer with a low{" "}
                    <B>temperature</B> of 0.2, which limits variation, and can write up to 2,048 tokens (pieces of
                    words). Both can be changed in <Code>config/llm_providers.json</Code>. In the chat, the answer is{" "}
                    <B>streamed</B>, so it appears as it is written. The instructions tell the model to:
                </P>
                <UL>
                    <LI>
                        <B>stay grounded</B>: answer from the retrieved chunks, and say when it does not know rather
                        than guess;
                    </LI>
                    <LI>cite specific laws and documents where possible;</LI>
                    <LI>focus on African countries and their own legal frameworks;</LI>
                    <LI>keep legal definitions precise rather than paraphrasing them;</LI>
                    <LI>
                        reply in the language of the question, and when a source is in another language, quote the legal
                        text in its original language with a translation;
                    </LI>
                    <LI>set out comparisons as a table, and answer counting questions with a number and a list.</LI>
                </UL>
                <P>
                    These are instructions, not guarantees. The tool does not automatically check that an answer or its
                    citations are supported by the retrieved chunks.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.batch}>
                <P>
                    Batch analysis runs up to 100 questions from a spreadsheet through the same RAG pipeline and puts
                    the answers in a PDF report. Each question is processed on its own, without conversation history.
                    Because every question is phrased once and asked the same way, batch analysis suits systematic
                    comparisons, such as running the same set of questions for several countries or repeating it over
                    time.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
