import { docMeta } from "../meta";
import { B, Code, DocSection, DocSubsection, DocTable, LI, P, UL } from "../primitives";

const { title, parts } = docMeta.extraction;

export function ExtractionSection() {
    return (
        <DocSection title={title}>
            <P>
                Before a document can be used to answer questions, it goes through an <B>ingestion pipeline</B>. The
                document is turned into text, described, split into short passages called <B>chunks</B>, and stored so
                that it can be searched. This runs in the background after an upload.
            </P>

            <DocSubsection title={parts.parsing}>
                <P>
                    <B>Parsing</B> means reading the text out of a file.
                </P>
                <UL>
                    <LI>
                        <B>PDF.</B> Each page is converted to Markdown-formatted text with PyMuPDF4LLM. Images found in
                        the pages are sent to a <B>multimodal large language model (LLM)</B>, a model that can read
                        images, and its descriptions are added to the page text.
                    </LI>
                    <LI>
                        <B>Word (.docx), text and Markdown.</B> The text is read directly from the file. Images are not
                        described.
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.metadata}>
                <P>
                    <B>Metadata</B> is information that describes a document. An LLM reads the opening of the document
                    (up to 3,000 characters, taken from the first page of a PDF) and records the country, country code,
                    a title and a short description. The topic area is not detected: whoever adds the document chooses
                    data protection or digital identity, or general when none is chosen.
                </P>
                <P>
                    The extracted metadata is not manually checked, so it can be wrong. If the model’s reply cannot be
                    read, the country is recorded as “Unknown”. A search limited to one country will then miss the
                    document, although broader searches can still find it.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.chunking}>
                <P>
                    <B>Chunking</B> splits a document into pieces that are small enough to search and to give to the LLM
                    as evidence. The tool uses <B>recursive character text splitting</B> (LangChain’s{" "}
                    <Code>RecursiveCharacterTextSplitter</Code>). It first tries to split the text between paragraphs.
                    If a piece is still too long, it splits between lines, then between words, and only then within a
                    word. Small neighbouring pieces are joined up to the size limit.
                </P>
                <DocTable
                    head={["Setting", "Value"]}
                    rows={[
                        ["Method", "Recursive character text splitting"],
                        ["Chunk size", "Up to 1,500 characters. Size is measured in characters, not in model tokens."],
                        [
                            "Chunk overlap",
                            "Up to 100 characters repeated between neighbouring chunks. If no whole paragraph, line or word at the split fits within this limit, there is no overlap.",
                        ],
                        ["Split order", "Paragraphs, then lines, then words, then characters"],
                        [
                            "Page boundaries",
                            "A PDF is chunked page by page, so a chunk never spans two pages. Other formats are chunked across the whole document.",
                        ],
                        [
                            "Metadata on each chunk",
                            "The document’s extracted details, its topic area and whether it is public or private",
                        ],
                    ]}
                />
                <P>
                    These settings are fixed in the backend code, not in a configuration file.
                </P>
                <P>
                    Splitting at natural breaks helps keep related sentences together, and overlap helps keep some
                    context where text is cut. The method follows the length and layout of the text, not its meaning or
                    legal structure. It is not <em>semantic chunking</em> or article-by-article chunking, so one article
                    or clause can end up in more than one chunk.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.indexing}>
                <P>
                    <B>Indexing</B> stores the chunks so that they can be searched quickly. Each chunk is stored in the
                    Qdrant vector database with two kinds of <B>vector</B> (a list of numbers that stands for the text):
                </P>
                <UL>
                    <LI>
                        <B>Dense vector, or embedding.</B> An embedding model captures the meaning of the chunk, so that
                        text with a similar meaning can be found even when the wording differs. The model is
                        configurable; the usual default is <Code>text-embedding-3-small</Code>.
                    </LI>
                    <LI>
                        <B>Sparse vector, for keywords.</B> A BM25 sparse encoder (<Code>Qdrant/bm25</Code>, run with
                        FastEmbed) records the words in the chunk, based on how often they occur and how long the text
                        is. This helps to match exact terms, names and numbers. It uses the English defaults for
                        reducing words to their stem and skipping very common words.
                    </LI>
                </UL>
                <P>
                    Public and private documents are kept in separate <B>collections</B>. The topic area and country are
                    stored with each chunk, so that searches can filter on them. If the embedding model changes, the
                    documents must be indexed again.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
