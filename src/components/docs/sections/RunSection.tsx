import { CodeBlock } from "../CodeBlock";
import { docMeta, anchor } from "../meta";
import { A, B, Code, DocSection, DocSubsection, DocTable, LI, Note, P, REPOS, Step, Steps, UL } from "../primitives";

const { title, parts } = docMeta.run;

export function RunSection() {
    return (
        <DocSection title={title}>
            <P>
                The Policy Analyzer is open source under the MIT licence. This guide takes you from nothing installed to
                a working copy on your own computer, with the steps in the order they must be done. It takes about 15 to
                20 minutes, most of it waiting for the first Docker build. The backend comes first, because the website
                needs it to be running.
            </P>

            <DocSubsection title={parts.need}>
                <DocTable
                    head={["Tool", "What it is for", "Check that it is installed"]}
                    rows={[
                        ["Git", "Downloading the code", <Code key="git">git --version</Code>],
                        [
                            "Docker, with Compose",
                            "Running the backend and its databases",
                            <Code key="docker">docker compose version</Code>,
                        ],
                        ["Python 3", "Running two small setup commands", <Code key="python">python --version</Code>],
                        ["Node.js 22 or newer", "Running the website", <Code key="node">node --version</Code>],
                    ]}
                />
                <P>
                    Install Docker Desktop (Windows and macOS) or Docker Engine (Linux), and make sure it is running
                    before you start. If a check prints “command not found”, install that tool first. On some systems
                    Python is called <Code>python3</Code>.
                </P>
                <P>
                    You also need an AI provider. The simplest is an OpenAI API key, which you can create at{" "}
                    <A href="https://platform.openai.com/api-keys">platform.openai.com/api-keys</A>. OpenAI charges for
                    its use. To use another provider instead, see <A href={anchor(parts.gateway)}>{parts.gateway}</A>.
                </P>
                <Note>
                    The commands in this guide work in a terminal on macOS and Linux, and in Git Bash on Windows. In
                    Windows PowerShell, use <Code>Copy-Item</Code> where the guide says <Code>cp</Code>.
                </Note>
            </DocSubsection>

            <DocSubsection title={parts.backend}>
                <Steps>
                    <Step n={1} title="Download the code">
                        <CodeBlock label="Terminal">{`git clone ${REPOS.backend}.git
cd policy-analyzer-backend`}</CodeBlock>
                    </Step>
                    <Step n={2} title="Create your settings file">
                        <P>
                            The backend reads its settings from a file named <Code>.env</Code>. Copy the template, then
                            open the new file in any text editor. You will fill in three values in the next two steps.
                        </P>
                        <CodeBlock label="Terminal">{`cp .env.example .env`}</CodeBlock>
                    </Step>
                    <Step n={3} title="Generate your API key">
                        <P>
                            The API key is a password that protects your backend. No website issues it to you: you make
                            it up. This command generates a strong one:
                        </P>
                        <CodeBlock label="Terminal">{`python -c "import secrets; print(secrets.token_urlsafe(32))"`}</CodeBlock>
                        <P>
                            Copy the long text it prints and paste it after <Code>API_KEY=</Code> in your{" "}
                            <Code>.env</Code> file. Keep it at hand, because you will use the same value for the website
                            in Step 2. The <Code>.env</Code> file is already excluded from Git, so it will not be
                            committed by accident.
                        </P>
                    </Step>
                    <Step n={4} title="Add your OpenAI key and the database address">
                        <P>
                            In the same <Code>.env</Code> file, set these three values. Leave every other value as it
                            is.
                        </P>
                        <CodeBlock label=".env">{`API_KEY=the-key-you-generated-in-step-3
OPENAI_API_KEY=your-openai-key
MONGODB_CONNECTION_STRING=mongodb://mongo:27017`}</CodeBlock>
                        <P>
                            <Code>MONGODB_CONNECTION_STRING</Code> tells the backend to use the MongoDB container that
                            Docker starts in step 6.
                        </P>
                    </Step>
                    <Step n={5} title="Point the model names at OpenAI">
                        <P>
                            The project’s model settings are written for a gateway. If you call OpenAI directly, run
                            this once. It only edits <Code>config/llm_providers.json</Code>.
                        </P>
                        <CodeBlock label="Terminal">{`python scripts/use_openai_models.py`}</CodeBlock>
                        <P>
                            If you use a gateway instead, skip this step and follow{" "}
                            <A href={anchor(parts.gateway)}>{parts.gateway}</A>.
                        </P>
                    </Step>
                    <Step n={6} title="Start the backend and its databases">
                        <CodeBlock label="Terminal">{`docker compose --profile local-db up -d --build`}</CodeBlock>
                        <P>
                            This builds the backend and starts four containers: the backend, MongoDB, Qdrant (which
                            stores the document passages) and Redis (a cache). The first run takes several minutes. When
                            the command returns, check that all four are running:
                        </P>
                        <CodeBlock label="Terminal">{`docker compose ps`}</CodeBlock>
                    </Step>
                    <Step n={7} title="Load the country data">
                        <P>This fills the maps and the Sources page. Run it once, after the containers are up.</P>
                        <CodeBlock label="Terminal">{`docker compose exec backend uv run python scripts/seed_reference_data.py`}</CodeBlock>
                    </Step>
                    <Step n={8} title="Check that it works">
                        <CodeBlock label="Terminal">{`curl http://localhost:8000/api/monitoring/health -H "X-API-Key: YOUR_API_KEY"`}</CodeBlock>
                        <P>
                            Replace <Code>YOUR_API_KEY</Code> with your key. You should get a short JSON reply, not an
                            error. You can also open <Code>http://localhost:8000/api/docs</Code> in your browser to see
                            the API.
                        </P>
                    </Step>
                </Steps>
            </DocSubsection>

            <DocSubsection title={parts.frontend}>
                <P>
                    Leave the backend running and open a new terminal window. The website needs Node.js 22 or newer.
                </P>
                <Steps>
                    <Step n={1} title="Download the code">
                        <CodeBlock label="Terminal">{`git clone ${REPOS.frontend}.git
cd policy-analyzer-frontend`}</CodeBlock>
                    </Step>
                    <Step n={2} title="Install the website’s packages">
                        <P>This downloads the libraries the website uses. It can take a few minutes.</P>
                        <CodeBlock label="Terminal">{`npm install`}</CodeBlock>
                    </Step>
                    <Step n={3} title="Create the settings file">
                        <CodeBlock label="Terminal">{`cp .env.example .env`}</CodeBlock>
                        <P>Open the new file and set these two values:</P>
                        <CodeBlock label=".env">{`BACKEND_API_URL=http://localhost:8000/api
BACKEND_API_KEY=the-same-API_KEY-as-in-the-backend`}</CodeBlock>
                        <P>
                            <Code>BACKEND_API_URL</Code> is where the backend answers. The value above is right when
                            the backend runs on your computer. <Code>BACKEND_API_KEY</Code> must be exactly the same
                            as <Code>API_KEY</Code> in the backend’s <Code>.env</Code>, or the backend will refuse the
                            website’s requests. Both values stay on the website’s server: visitors’ browsers never
                            receive the key.
                        </P>
                    </Step>
                    <Step n={4} title="Start the website">
                        <CodeBlock label="Terminal">{`npm run dev`}</CodeBlock>
                        <P>
                            Open <Code>http://localhost:3000</Code>. The maps should load. If they are empty, the
                            country data was not loaded: repeat step 7 of the backend.
                        </P>
                    </Step>
                </Steps>

                <P>
                    <B>Prefer Docker for the website?</B> Skip steps 2 to 4 and build an image instead. The settings are
                    passed when the container starts, and Docker ignores <Code>.env</Code>, so pass them with{" "}
                    <Code>-e</Code>. Inside a container, <Code>localhost</Code> is the container itself, so{" "}
                    <Code>host.docker.internal</Code> is used to reach a backend on the same computer.
                </P>
                <CodeBlock label="Terminal">{`docker build -t policy-analyzer-frontend .

docker run -d --name policy-analyzer-frontend -p 3000:3000 \\
  -e BACKEND_API_URL=http://host.docker.internal:8000/api \\
  -e BACKEND_API_KEY=the-same-API_KEY-as-in-the-backend \\
  policy-analyzer-frontend`}</CodeBlock>
            </DocSubsection>

            <DocSubsection title={parts.documents}>
                <P>
                    The chat answers from a collection of documents, and the collection starts empty. To add your first
                    laws or policies:
                </P>
                <Steps>
                    <Step n={1} title="Open the chat">
                        <P>
                            On the website, open <B>Chat</B> and choose <B>Upload documents</B> in the sidebar.
                        </P>
                    </Step>
                    <Step n={2} title="Choose the files and the topic">
                        <P>
                            Select PDF, Word, text or Markdown files, then choose whether they concern Data Protection
                            or Digital ID.
                        </P>
                    </Step>
                    <Step n={3} title="Upload and wait">
                        <P>
                            Processing runs in the background. The AI model reads each document to record its country,
                            title and description, then splits it into passages that can be searched. When it has
                            finished, ask a question in the chat.
                        </P>
                    </Step>
                </Steps>
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
                        <Code>config/llm_providers.json</Code>, set the model used for each task to a name your gateway
                        offers.
                    </LI>
                    <LI>
                        <B>Changing the embedding model.</B> Passages indexed with one embedding model cannot be
                        searched reliably with another. Upload the documents again after you change it.
                    </LI>
                    <LI>
                        <B>Web search (optional).</B> Set <Code>TAVILY_API_KEY</Code> to enable the web search described
                        under <A href={anchor(docMeta.analysis.parts.supplementary)}>Supplementary evidence</A>.
                    </LI>
                </UL>
                <P>
                    Keep the keys in the backend’s <Code>.env</Code> and out of the repository.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.trouble}>
                <DocTable
                    head={["What you see", "What to do"]}
                    rows={[
                        [
                            <>
                                The backend log says <Code>Failed to connect to MongoDB</Code>
                            </>,
                            <>
                                Run <Code>docker compose ps</Code> and check that MongoDB is running, and that{" "}
                                <Code>MONGODB_CONNECTION_STRING</Code> is <Code>mongodb://mongo:27017</Code>.
                            </>,
                        ],
                        ["The maps or the Sources page are empty", "Load the country data (step 7 of the backend)."],
                        [
                            "The website cannot reach the backend",
                            <>
                                Check that <Code>BACKEND_API_KEY</Code> matches <Code>API_KEY</Code> exactly. After
                                editing the website’s <Code>.env</Code>, stop <Code>npm run dev</Code> and start it
                                again.
                            </>,
                        ],
                        [
                            "You changed the backend’s .env and nothing happened",
                            <>
                                Run <Code>docker compose up -d --force-recreate backend</Code>. A plain restart does not
                                reload <Code>.env</Code>.
                            </>,
                        ],
                        [
                            "You want to see what the backend is doing",
                            <>
                                Run <Code>docker compose logs -f backend</Code>.
                            </>,
                        ],
                        [
                            <>
                                <Code>permission denied</Code> when running Docker on Linux
                            </>,
                            "Put sudo in front of the Docker commands, or add your user to the docker group.",
                        ],
                    ]}
                />
                <P>
                    To stop the backend and keep your data, run <Code>docker compose --profile local-db down</Code>. Do
                    not add <Code>-v</Code> unless you want to delete all the data.
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
