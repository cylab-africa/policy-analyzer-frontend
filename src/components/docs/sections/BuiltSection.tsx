import { ArchitectureDiagram } from "../diagrams/ArchitectureDiagram";
import { anchor, docMeta } from "../meta";
import { A, B, DocSection, DocSubsection, DocTable, LI, P, UL } from "../primitives";

export function BuiltSection() {
    return (
        <DocSection title={docMeta.built.title}>
            <P>
                The Policy Analyzer is made of two applications and a few supporting services. Together they form a{" "}
                <B>hybrid retrieval-augmented generation (RAG)</B> system: it searches a document collection by meaning
                and by keywords, and a large language model (LLM) writes answers from what is found.
            </P>
            <ArchitectureDiagram />
            <UL>
                <LI>
                    <B>Frontend (website).</B> A Next.js application written in TypeScript. It draws the maps,
                    statistics and Sources library, and it provides the chat and upload screens. It talks to the backend
                    through an API.
                </LI>
                <LI>
                    <B>Backend (API).</B> A Python application built with FastAPI. It answers questions, processes
                    uploaded documents, runs batch jobs, and serves the country reference data.
                </LI>
                <LI>
                    <B>Vector database (Qdrant).</B> Stores each document chunk with its dense vector (embedding), sparse
                    keyword vector and metadata. Public and private documents are in separate collections, and the topic
                    area is a metadata filter.
                </LI>
                <LI>
                    <B>MongoDB.</B> Stores the country reference data, document-processing tasks and batch jobs.
                </LI>
                <LI>
                    <B>SQLite.</B> A small file database on the backend server that keeps chat history, which gives
                    follow-up questions their context.
                </LI>
                <LI>
                    <B>Redis.</B> Holds a <B>semantic cache</B> of search results. When a search with the same filters
                    has a query embedding almost identical to an earlier one (cosine similarity of at least 0.98 by
                    default), the earlier results can be reused for up to an hour. Generated answers are not cached.
                </LI>
                <LI>
                    <B>AI model provider.</B> A large language model (LLM) and an embedding model, reached through an
                    OpenAI-compatible API, either from OpenAI directly or through an AI gateway you run. The project
                    uses these models as provided: it does not train or fine-tune them.
                </LI>
                <LI>
                    <B>Optional services.</B> A web search service for recent developments, an email server for batch
                    notifications, and Amazon S3 for storing uploaded files.
                </LI>
            </UL>

            <DocSubsection title={docMeta.built.parts.pipeline}>
                <P>There are two pipelines. One prepares documents, and the other answers questions.</P>
                <DocTable
                    head={["Stage", "Technique"]}
                    rows={[
                        [<B key="s">When a document is added</B>, ""],
                        ["Parsing", "Text extraction; a multimodal LLM describes images in PDFs"],
                        ["Metadata extraction", "LLM reads the opening of the document"],
                        ["Chunking", "Recursive character splitting: up to 1,500 characters, up to 100 overlap"],
                        ["Embedding", "Dense embeddings and BM25 sparse vectors"],
                        ["Indexing", "Qdrant vector database"],
                        [<B key="q">When a question is asked</B>, ""],
                        ["Query processing", "Query rewriting, scope guardrail, topic, entity and intent detection"],
                        ["Retrieval", "Hybrid search with metadata filtering and Reciprocal Rank Fusion"],
                        ["Augmentation", "Web search, only when rules call for it"],
                        ["Generation", "Grounded, streamed LLM answer guided by a prompt"],
                    ]}
                />
                <P>
                    See <A href={anchor(docMeta.extraction.title)}>{docMeta.extraction.title}</A> and{" "}
                    <A href={anchor(docMeta.analysis.title)}>{docMeta.analysis.title}</A> for the details.
                </P>
            </DocSubsection>

            <P>Four design choices shape the tool:</P>
            <UL>
                <LI>
                    <B>Retrieval comes first.</B> The tool retrieves relevant chunks and then generates an answer using
                    them as context, instead of relying only on the general knowledge of an LLM.
                </LI>
                <LI>
                    <B>Topics, prompts and models are mostly configuration.</B> They are set in configuration files
                    rather than buried in the code. The two current topics are also named in a few places in the code,
                    so pointing the tool at another subject needs small code changes as well.
                </LI>
                <LI>
                    <B>The AI provider is replaceable.</B> Any OpenAI-compatible service can be used.
                </LI>
                <LI>
                    <B>Reference data is plain files.</B> Country records are JSON files in the repository, loaded into
                    the database by a script, so every change can be traced.
                </LI>
            </UL>
        </DocSection>
    );
}
