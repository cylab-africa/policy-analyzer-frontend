import { docMeta, anchor } from "../meta";
import { A, B, Code, DocSection, DocSubsection, LI, OL, P, REPOS, UL } from "../primitives";

const { title, parts } = docMeta.run;

export function RunSection() {
    return (
        <DocSection title={title}>
            <P>
                The Policy Analyzer is open source under the MIT licence. Anyone can run a copy with their own
                documents and their own AI provider. Each repository’s README has the full step-by-step instructions,
                and the quick start takes about 10 minutes with Docker, most of it the first build.
            </P>

            <DocSubsection title={parts.need}>
                <UL>
                    <LI>Git and Docker. Node.js 20 or newer is needed only to run the frontend without Docker.</LI>
                    <LI>
                        Access to a language model and an embedding model through an OpenAI-compatible API (see{" "}
                        <A href={anchor(parts.gateway)}>{parts.gateway}</A>).
                    </LI>
                    <LI>
                        A MongoDB database. The Docker setup can start one for you, along with the vector store
                        (Qdrant) and the cache (Redis).
                    </LI>
                </UL>
            </DocSubsection>

            <DocSubsection title={parts.setup}>
                <OL>
                    <LI>
                        <B>Start the backend.</B> Clone the <A href={REPOS.backend}>backend</A>, copy{" "}
                        <Code>.env.example</Code> to <Code>.env</Code>, set the values marked required, and start the
                        stack with Docker Compose.
                    </LI>
                    <LI>
                        <B>Load the country data.</B> Run the seed script to fill the maps and the Sources page.
                    </LI>
                    <LI>
                        <B>Start the frontend.</B> Clone the <A href={REPOS.frontend}>frontend</A> and point{" "}
                        <Code>NEXT_PUBLIC_API_URL</Code> at your backend. Set <Code>NEXT_PUBLIC_API_KEY</Code> to the
                        same value as the backend’s <Code>API_KEY</Code>.
                    </LI>
                    <LI>
                        <B>Add documents.</B> The document collection starts empty. Upload laws and policies from the
                        chat page, choosing a topic area for each.
                    </LI>
                </OL>
            </DocSubsection>

            <DocSubsection title={parts.gateway}>
                <P>
                    The analysis uses two AI services: a language model, which rewrites questions and writes answers,
                    and an embedding model, which turns passages and questions into numbers so that similar ones can be
                    matched. Both are reached through an OpenAI-compatible API. The backend can call OpenAI directly, or
                    a gateway that you run, such as LiteLLM, which forwards requests to other providers.
                </P>
                <UL>
                    <LI>
                        <B>Direct to OpenAI.</B> Set <Code>OPENAI_API_KEY</Code> in the backend’s <Code>.env</Code>,
                        then run <Code>python scripts/use_openai_models.py</Code> once to switch the model names in{" "}
                        <Code>config/llm_providers.json</Code> to OpenAI’s.
                    </LI>
                    <LI>
                        <B>Through a gateway.</B> Set <Code>OPENAI_API_KEY</Code> to your gateway’s key and{" "}
                        <Code>OPENAI_BASE_URL</Code> to its address, usually ending in <Code>/v1</Code>. In{" "}
                        <Code>config/llm_providers.json</Code>, set the model used for each task to a name your
                        gateway offers.
                    </LI>
                    <LI>
                        <B>Changing the embedding model.</B> Passages indexed with one embedding model cannot be
                        searched reliably with another. Upload the documents again after you change it.
                    </LI>
                    <LI>
                        <B>Web search (optional).</B> Set <Code>TAVILY_API_KEY</Code> to enable the web search
                        described under <A href={anchor(docMeta.analysis.parts.supplementary)}>Supplementary evidence</A>.
                    </LI>
                </UL>
                <P>
                    Keep the keys in the backend’s <Code>.env</Code> and out of the repository.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.online}>
                <P>
                    The default set-up shares a single API key with the browser, so anyone who can open the site can
                    read it. Keep the admin and document-upload routes off the public internet, and restrict CORS. The
                    backend README lists what to do before exposing an instance publicly.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
