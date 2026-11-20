The Policy Analyzer is an open-source web tool for exploring and comparing data protection and digital identity policy across Africa. This page documents the whole tool: what it is for, what it does, how it was built, how its information was collected and checked, how its results are produced, and how to run or extend your own copy. The source code is on GitHub, in two repositories: the [backend](https://github.com/cylab-africa/policy-analyzer-backend) and the [frontend](https://github.com/cylab-africa/policy-analyzer-frontend).

*Last updated November 2026.*

## What the Policy Analyzer does

The tool has six parts:

- **Home: continental overview.** Two interactive maps of the 55 African Union member states, one for data protection legislation and one for digital identity implementation. Filter a map by status, or click a country to see its details and sources. The page also shows headline statistics and a timeline of key milestones for each topic.
- **Sources.** A library of reference documents and research for each country, which you can browse by country and region. Each source has a short description of who published it and what kind of source it is.
- **Chat.** Write your question in plain language, in data protection or digital identity mode. Answers are written from a collection of policy documents, with web results added when the collection has too little. Your conversations are saved in your own browser.
- **Document upload.** Add a law or policy document, and choose its topic area, so that it can be drawn on in answers.
- **Batch analysis.** Run up to 100 questions at once from a spreadsheet and receive the answers as a PDF report. You can ask to be notified by email when the report is ready.
- **Documentation.** This page.

The tool works at two levels:

- **Country indicators**: the same set of indicators is recorded for every country. The maps and statistics let you compare countries by category across the continent, and each country's card gives the detail.
- **Document analysis**: questions are answered from the text of legal and policy documents. Use it for questions the indicators can't answer, such as what a law requires, what rights it gives, or how two countries' rules differ.

The analysis covers two topic areas: data protection and digital identity. Documents added without a topic are catalogued as general.

## About this documentation

### Purpose

This documentation explains the Policy Analyzer as a whole, so that readers can judge what it can tell them, how far to trust it, and how to reuse it. It describes the tool's features, design, data and method. For findings about a specific country, use the maps, the Sources library or the chat.

### Who it is for

- **Researchers and policy analysts** who use the tool to compare how countries regulate personal data and run digital identity systems. They need to know where the information comes from and what its limits are.
- **Implementers and advisers** working on data protection or digital identity, who want a quick, sourced view of a country or a comparison between countries.
- **Developers and research teams** who want to run their own copy, connect their own AI provider, or adapt the tool to another topic or region.
- **Partners and reviewers** who want to understand how the tool was built and checked.

### How to use it

| If you want to... | Read |
| --- | --- |
| Know what the tool does | [What the Policy Analyzer does](#what-the-policy-analyzer-does) |
| Understand where the data and the answers come from | [How information was collected](#how-information-was-collected), [Analysis method](#analysis-method) |
| Decide how far to rely on the results | [Verification and limitations](#verification-and-limitations) |
| Run or change your own copy | [Run your own instance](#run-your-own-instance), [Fork and extend](#fork-and-extend) |

### What you should take away

After reading this page you should be able to:

- describe what the Policy Analyzer does and what it does not do;
- explain how a country classification and an answer to a question are produced, and what evidence they rest on;
- judge how far to rely on the results, and what to check before you use them;
- run your own instance, connect it to your own AI provider, and extend it.

## How it is built

The Policy Analyzer is made of two applications and a few supporting services.

```text
Website (Next.js)  <-->  Backend API (FastAPI)  <-->  Data stores
                                                      - Qdrant: document passages, searched by meaning
                                                      - MongoDB: country data, document tasks, batch jobs
                                                      - SQLite: conversation history
                                                      - Redis: cache of repeated questions
                                                <-->  AI provider: language and embedding models
                                                <-->  Optional: web search, email, Amazon S3
```

Figure 1. How the parts connect. The website only talks to the backend; the backend talks to the data stores and to the AI provider.

- **Frontend (website).** A Next.js application written in TypeScript. It draws the maps, statistics and Sources library, and it provides the chat and upload screens. It talks to the backend through an API.
- **Backend (API).** A Python application built with FastAPI. It answers questions, processes uploaded documents, runs batch jobs, and serves the country reference data.
- **Vector database (Qdrant).** Stores the passages of each document in a form that can be searched by meaning, separately for each topic area.
- **MongoDB.** Stores the country reference data, document-processing tasks and batch jobs.
- **SQLite.** A small file database on the backend server that keeps conversation history, so follow-up questions can be understood in context.
- **Redis.** A cache that keeps the results of repeated questions.
- **AI provider.** The analysis uses a language model and an embedding model, reached through an OpenAI-compatible API. This can be OpenAI directly or an AI gateway you run.
- **Optional services.** A web search service for recent developments, an email server for batch notifications, and Amazon S3 for storing uploaded files.

Four design choices shape the tool:

- **Answers come from documents.** The tool finds the relevant passages first and then writes an answer from them, instead of relying on the general knowledge of an AI model.
- **Topics, prompts and models are mostly configuration.** They are set in configuration files rather than buried in the code. The two current topics are also named in a few places in the code, so pointing the tool at another subject needs small code changes as well.
- **The AI provider is replaceable.** Any OpenAI-compatible service can be used.
- **Reference data is plain files.** Country records are JSON files in the repository, loaded into the database by a script, so every change can be traced.

## How information was collected

The tool relies on two separate bodies of evidence.

### Reference sources for the country indicators

Most country records list reference material so that the classification can be checked against published sources. This includes country fact sheets, legal guides, the text of laws where we have found it, government and official sources, academic and policy research, reports by development partners and research institutes, and news reports on recent developments. All of it is collected in the **Sources** library, where readers can browse it by country and region.

In practice, every data protection record cites a country fact sheet from Data Protection Africa (ALT Advisory). Some also cite DLA Piper's overview of the country's law, and for a few countries the text of the law itself is linked. Malabo Convention status follows the African Union's official status list, updated with later ratifications reported in the news. Digital identity records cite World Bank ID4D diagnostics and other development-partner reports, research from organisations such as ECDPM, DiploFoundation and Research ICT Africa, and news reports on recent developments. Some digital identity records do not yet list a source. Most of these sources summarise the law rather than replace it, so check the law itself for anything you rely on.

### Document collection for analysis

Document-level analysis draws on a collection of policy documents, including laws, regulations and frameworks, organised by topic area. The collection is made of the texts of national legal instruments, such as data protection laws, added through the project's upload tools. The Sources library is a reading list for checking and further study. The document collection is what the analysis actually searches.

The collection is not a complete register of African law. It holds the documents that have been uploaded so far, and an answer can only reflect those documents, plus web results where they are used.

### Keeping the information current

The country indicators are recorded by hand by the project team. They are not generated automatically from the document collection, and no automatic rule assigns a category. The records are kept in the project's code repository, so changes to them can be traced. Documents are added to the collection through the upload tools.

## Country indicators

The country indicators give a consistent basis for comparison. Each country is placed in exactly one category for each indicator, so countries can be counted, mapped and compared. The maps cover all 55 African Union member states. The map data comes from Natural Earth, adapted to show African Union members, and is drawn for overview, not as an authoritative boundary reference.

### Data protection indicators

- **Legislation status**, in four categories:
    - **Comprehensive law**: a dedicated data protection law has been enacted, whether or not its regulator is operating yet.
    - **Draft legislation**: a data protection bill exists but has not been enacted.
    - **Limited framework**: personal data is addressed only partly, rather than through a dedicated law.
    - **No legislation**: no data protection legislation has been identified.
- **Year of enactment**, where it is known.
- **Malabo Convention status**: whether the country has ratified, signed or not signed the African Union Convention on Cyber Security and Personal Data Protection (2014).

### Digital identity indicators

- **Implementation status**, in four categories: fully operational, partially implemented, planning, or no information. "No information" means we have not found enough published information. It does not mean a country has no ID system.
- **Descriptive attributes**, where available: the issuing authority, the year the system was launched, a coverage figure, its main features and a short description. The coverage figure estimates how many people the system covers, and it is often reported by the issuing authority itself. It reads "Unknown" or "N/A" where no figure was found, and "Not yet launched" for systems that are still being planned.

Categories such as "limited framework" or "partially implemented" involve judgement. A single category cannot capture every nuance of a country's situation. Country records were last updated in October 2026, and ID programmes in particular change quickly.

## Information extraction

Before a document can be analysed, it is broken down into passages that can be searched and used as evidence:

1. **Text extraction.** The full text is extracted from the original document.
2. **Cataloguing.** The opening part of the document is read to record the country it concerns, a title and a short description.
3. **Topic labelling.** Whoever adds the document chooses its topic area: data protection or digital identity, or general when none is chosen.
4. **Division into passages.** The text is divided into short, overlapping passages of a few paragraphs each. Every passage carries the document's country and topic labels.

As a result, each piece of evidence is a specific passage of a document rather than the document as a whole. It can be found by country and topic, and an analysis can focus on the provisions that matter for a question.

The country, title and description are detected automatically and are not manually checked, so a misreading is possible. If the country cannot be identified, the document is catalogued as "Unknown". Analyses focused on a specific country will not find it, but analyses across the whole topic can.

## Analysis method

Questions are answered by finding the relevant evidence first and then writing an answer from that evidence. The answer is not drawn from the general knowledge of an AI model alone. This approach is often called *retrieval-augmented generation*.

```text
1. Question  ->  2. Check and frame  ->  3. Find evidence  ->  (4. Web results, only when needed)  ->  5. Write the answer
```

Figure 2. From question to answer. Step 4 happens only when little evidence is found or the question is about recent developments.

### Framing the question

- **Context.** A follow-up question that refers back to the conversation, such as "What penalties does it set?", is rewritten into a complete question using the last few messages.
- **Scope.** Questions are checked against the analyser's scope: data protection and privacy law, digital identity systems, personal data governance, consent and user rights, biometrics, and related cybersecurity regulation in the African context. Questions that are clearly off-topic are declined with an explanation of what is covered.

### Locating the evidence

- **Topic and country focus.** The analysis is limited to the selected topic area and to any African countries the question names.
- **Selecting passages.** The passages closest in meaning to the question are selected: usually a handful, and more for comparisons and questions that involve counting.
- **Comparisons.** Comparative questions gather evidence for each country named, so that every country is represented.
- **Widening the search.** If no evidence is found for a named country, the search widens to the whole topic. If there is still nothing, it widens to the whole collection.

### Supplementary evidence

If very little evidence is found, or the question asks about recent or current developments, the analysis also runs a web search. Answers that use web results are instructed to include a note saying so.

### Writing the answer

The answer is written from the evidence collected. It follows these rules:

- Base the answer on the evidence, and say when information is not available rather than guess.
- Cite specific laws and documents where possible.
- Focus on African countries and their own legal frameworks.
- Keep legal definitions precise rather than paraphrasing them.
- Reply in the language the question was asked in. When a source is in another language, quote the legal text in its original language with a translation.

### Analysing many questions at once

Batch analysis applies the same method to a list of up to 100 questions supplied as a spreadsheet, and compiles the answers into a PDF report. Because every question is phrased once and asked the same way, batch analysis suits systematic comparisons, such as running the same set of questions for several countries or repeating it over time.

## How insights are derived

- **Continental statistics.** The figures on the Home page count how many countries fall into each indicator category. They are calculated directly from the country records, so they always match the maps.
- **Policy timeline.** The timeline on the Home page presents selected milestones in data protection and digital identity across the continent, organised by year. Each entry is taken from a dated source, and figures are as reported on the date given. The date of the last update is shown on the timeline.
- **Document-based findings.** An answer is a new synthesis of the evidence found for that question, not a stored conclusion. Rewording a question can bring up different passages and so produce a different answer. Asking questions in a fixed form, as batch analysis does, makes results easier to compare.

## Verification and limitations

> Answers are generated by an AI model. They have not been systematically evaluated, and they are not legal advice. Verify anything you rely on against the original law.

### What has been checked

- **Country records.** The country records were reviewed against published sources in October 2026, including the African Union's official Malabo Convention status list. Records that were out of date were corrected.
- **Source links.** The links in the Sources library were checked in October 2026, and broken or misdescribed links were fixed.
- **Reference data files.** Automated tests in the backend repository check the country data files: that every African Union member has a record, that statuses are valid, and that links are well formed.
- **Built-in checks.** Several checks are built into the method:
    - questions outside the analyser's scope are declined;
    - answers are instructed to rely on the evidence found and to say when it is insufficient;
    - answers that draw on web results are instructed to say so.

Some of these checks work through instructions given to the AI model, so they cannot be guaranteed on every answer.

### What has not been checked

- **Answers have not been systematically evaluated.** Answers are generated by an AI model, and their accuracy has not been formally assessed. Check important points against the original law or document before relying on an answer.
- **Automatic extraction is not reviewed.** The country, title and description detected for each document are not manually checked.
- **Some classifications rest on secondary sources.** Where a law was reported by news or a legal guide, it may not have been confirmed against the text of the law itself.

### Limitations to keep in mind

- **Coverage depends on the collection.** An answer can only be as complete and current as the documents it draws on. Laws are amended, and new instruments are adopted.
- **Check that the answer is about the right country.** When no evidence is found for a named country, the search widens, so an answer may draw on general material or other countries' laws. Check that the answer is about the country's own law, and confirm it against the text of that law.
- **Web results are not reviewed.** Answers that include web results rely on external sources the project team has not checked.
- **Indicators simplify.** One category per indicator can hide nuance, such as sector-specific rules or laws that are enacted but not yet in force. Legislation status records that a law has been enacted, not whether a regulator is operating or enforcing it. Use the reference sources to see the detail.
- **Not legal advice.** The Policy Analyzer is a research and information tool. It does not replace advice from a qualified legal professional.

## Run your own instance

The Policy Analyzer is open source under the MIT licence. This guide takes you from nothing installed to a working copy on your own computer, with the steps in the order they must be done. It takes about 15 to 20 minutes, most of it waiting for the first Docker build. The backend comes first, because the website needs it to be running.

### What you need

| Tool | What it is for | Check that it is installed |
| --- | --- | --- |
| Git | Downloading the code | `git --version` |
| Docker, with Compose | Running the backend and its databases | `docker compose version` |
| Python 3 | Running two small setup commands | `python --version` |
| Node.js 22 or newer | Running the website | `node --version` |

Install Docker Desktop (Windows and macOS) or Docker Engine (Linux), and make sure it is running before you start. If a check prints "command not found", install that tool first. On some systems Python is called `python3`.

You also need an AI provider. The simplest is an OpenAI API key, which you can create at [platform.openai.com/api-keys](https://platform.openai.com/api-keys). OpenAI charges for its use. To use another provider instead, see [Connect an AI gateway](#connect-an-ai-gateway).

> The commands in this guide work in a terminal on macOS and Linux, and in Git Bash on Windows. In Windows PowerShell, use `Copy-Item` where the guide says `cp`.

### Step 1: Set up the backend

**1. Download the code**

```bash
git clone https://github.com/cylab-africa/policy-analyzer-backend.git
cd policy-analyzer-backend
```

**2. Create your settings file**

The backend reads its settings from a file named `.env`. Copy the template, then open the new file in any text editor. You will fill in three values in the next two steps.

```bash
cp .env.example .env
```

**3. Generate your API key**

The API key is a password that protects your backend. No website issues it to you: you make it up. This command generates a strong one:

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Copy the long text it prints and paste it after `API_KEY=` in your `.env` file. Keep it at hand, because you will use the same value for the website in Step 2. The `.env` file is already excluded from Git, so it will not be committed by accident.

**4. Add your OpenAI key and the database address**

In the same `.env` file, set these three values. Leave every other value as it is.

```bash
API_KEY=the-key-you-generated-in-step-3
OPENAI_API_KEY=your-openai-key
MONGODB_CONNECTION_STRING=mongodb://mongo:27017
```

`MONGODB_CONNECTION_STRING` tells the backend to use the MongoDB container that Docker starts in step 6.

**5. Point the model names at OpenAI**

The project's model settings are written for a gateway. If you call OpenAI directly, run this once. It only edits `config/llm_providers.json`.

```bash
python scripts/use_openai_models.py
```

If you use a gateway instead, skip this step and follow [Connect an AI gateway](#connect-an-ai-gateway).

**6. Start the backend and its databases**

```bash
docker compose --profile local-db up -d --build
```

This builds the backend and starts four containers: the backend, MongoDB, Qdrant (which stores the document passages) and Redis (a cache). The first run takes several minutes. When the command returns, check that all four are running:

```bash
docker compose ps
```

**7. Load the country data**

This fills the maps and the Sources page. Run it once, after the containers are up.

```bash
docker compose exec backend python scripts/seed_reference_data.py
```

**8. Check that it works**

```bash
curl http://localhost:8000/api/monitoring/health -H "X-API-Key: YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your key. You should get a short JSON reply, not an error. You can also open `http://localhost:8000/api/docs` in your browser to see the API (this page only exists while `ENABLE_API_DOCS=true` is set in the backend's `.env`).

### Step 2: Set up the website (Frontend)

Leave the backend running and open a new terminal window. The website needs Node.js 22 or newer.

**1. Download the code**

```bash
git clone https://github.com/cylab-africa/policy-analyzer-frontend.git
cd policy-analyzer-frontend
```

**2. Install the website's packages**

This downloads the libraries the website uses. It can take a few minutes.

```bash
npm install
```

**3. Create the settings file**

```bash
cp .env.example .env
```

Open the new file and set these two values:

```bash
BACKEND_API_URL=http://localhost:8000/api
BACKEND_API_KEY=the-same-API_KEY-as-in-the-backend
```

`BACKEND_API_URL` is where the backend answers. The value above is right when the backend runs on your computer. `BACKEND_API_KEY` must be exactly the same as `API_KEY` in the backend's `.env`, or the backend will refuse the website's requests. Both values stay on the website's server: visitors' browsers never receive the key.

**4. Start the website**

```bash
npm run dev
```

Open `http://localhost:3000`. The maps should load. If they are empty, the country data was not loaded: repeat step 7 of the backend.

**Prefer Docker for the website?** Skip steps 2 to 4 and build an image instead. The settings are passed when the container starts, and Docker ignores `.env`, so pass them with `-e`. Inside a container, `localhost` is the container itself, so `host.docker.internal` is used to reach a backend on the same computer.

```bash
docker build -t policy-analyzer-frontend .

docker run -d --name policy-analyzer-frontend -p 3000:3000 \
  -e BACKEND_API_URL=http://host.docker.internal:8000/api \
  -e BACKEND_API_KEY=the-same-API_KEY-as-in-the-backend \
  policy-analyzer-frontend
```

### Step 3: Add documents

The chat answers from a collection of documents, and the collection starts empty. To add your first laws or policies:

1. **Open the chat.** On the website, open **Chat** and choose **Upload documents** in the sidebar.
2. **Choose the files and the topic.** Select PDF, Word, text or Markdown files, then choose whether they concern Data Protection or Digital ID.
3. **Upload and wait.** Processing runs in the background. The AI model reads each document to record its country, title and description, then splits it into passages that can be searched. When it has finished, ask a question in the chat.

### Connect an AI gateway

The analysis uses two AI services: a language model, which rewrites questions and writes answers, and an embedding model, which turns passages and questions into numbers so that similar ones can be matched. Both are reached through an OpenAI-compatible API. The backend can call OpenAI directly, or a gateway that you run, such as LiteLLM, which forwards requests to other providers.

- **Direct to OpenAI.** Set `OPENAI_API_KEY` in the backend's `.env`, then run `python scripts/use_openai_models.py` once to switch the model names in `config/llm_providers.json` to OpenAI's.
- **Through a gateway.** Set `OPENAI_API_KEY` to your gateway's key and `OPENAI_BASE_URL` to its address, usually ending in `/v1`. In `config/llm_providers.json`, set the model used for each task to a name your gateway offers.
- **Changing the embedding model.** Passages indexed with one embedding model cannot be searched reliably with another. Upload the documents again after you change it.
- **Web search (optional).** Set `TAVILY_API_KEY` to enable the web search described under [Supplementary evidence](#supplementary-evidence).

Keep the keys in the backend's `.env` and out of the repository.

### If something goes wrong

| What you see | What to do |
| --- | --- |
| The backend log says `Failed to connect to MongoDB` | Run `docker compose ps` and check that MongoDB is running, and that `MONGODB_CONNECTION_STRING` is `mongodb://mongo:27017`. |
| The maps or the Sources page are empty | Load the country data (step 7 of the backend). |
| The website cannot reach the backend | Check that `BACKEND_API_KEY` matches `API_KEY` exactly. After editing the website's `.env`, stop `npm run dev` and start it again. |
| You changed the backend's .env and nothing happened | Run `docker compose up -d --force-recreate backend`. A plain restart does not reload `.env`. |
| You want to see what the backend is doing | Run `docker compose logs -f backend`. |
| `permission denied` when running Docker on Linux | Put sudo in front of the Docker commands, or add your user to the docker group. |

To stop the backend and keep your data, run `docker compose --profile local-db down`. Do not add `-v` unless you want to delete all the data.

### Before you put it online

The website keeps the API key on its own server and never sends it to visitors' browsers. The key is still one shared password with no user accounts, so anyone who can reach the backend directly with it can use every route. Keep the backend reachable only from the website's server, and keep the admin and document-upload routes off the public internet. Before going live, also set `REDIS_PASSWORD`, leave `ENABLE_API_DOCS` off, and set `TRUSTED_PROXY_IPS` to the website server's address so that each visitor gets their own rate limit. If you use the MongoDB container from this guide, give it a login by setting `MONGO_ROOT_USERNAME` and `MONGO_ROOT_PASSWORD` in the backend's `.env` before the first start, and back the database up regularly, because nothing does it for you. Browsers need no CORS access, because the website calls the backend from its server. The backend README lists everything to check before exposing an instance publicly.

## Fork and extend

The code is released under the MIT licence, so you may copy it, change it and share it, including in your own projects. Where to start depends on what you want to change:

| If you want to... | Do this |
| --- | --- |
| Use a different AI provider or model | Follow [Connect an AI gateway](#connect-an-ai-gateway). No code changes are needed. |
| Change or add country data | The country records are plain data files in the backend. Edit them, then load them again with the setup script. The backend README explains the steps. |
| Cover a different topic or region | This is possible but takes more work, because a few settings files and places in the code mention data protection and digital identity. The backend README lists them under [Adapting to another topic](https://github.com/cylab-africa/policy-analyzer-backend#adapting-to-another-topic). |
| Change how the website looks | The pages and components are in the `src` folder of the frontend. This documentation is built from the files in `src/components/docs`, one for each section. |
| Share your improvements | Read `CONTRIBUTING.md` in each repository. To report wrong country data, open a "data correction" issue. Never commit API keys, passwords or documents you are not allowed to share. |

To cite the tool, use the `CITATION.cff` file in each repository.

## Feedback and corrections

If you notice an error, an outdated classification or a missing document, please write to [upanzi@andrew.cmu.edu](mailto:upanzi@andrew.cmu.edu), or open an issue in the [backend](https://github.com/cylab-africa/policy-analyzer-backend/issues) or [frontend](https://github.com/cylab-africa/policy-analyzer-frontend/issues) repository. Corrections from users help keep the indicators and the document collection accurate.

To correct this documentation itself, you can [edit its sections on GitHub](https://github.com/cylab-africa/policy-analyzer-frontend/tree/main/src/components/docs/sections) and open a pull request.
