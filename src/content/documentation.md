The Policy Analyzer is an open-source web tool for exploring and comparing data protection and digital identity policy across Africa. This page documents the whole tool: what it is for, what it does, how it was built, how its information was collected and checked, how its results are produced, and how to run or extend your own copy. The source code is on GitHub, in two repositories: the [backend](https://github.com/cylab-africa/policy-analyzer-backend) and the [frontend](https://github.com/cylab-africa/policy-analyzer-frontend).

## About this documentation

### Purpose

This documentation explains the Policy Analyzer as a whole, so that readers can judge what it can tell them, how far to trust it, and how to reuse it. It describes the tool's features, design, data and method. It does not report policy findings; the tool itself does that.

### Who it is for

- **Researchers and policy analysts** who use the tool to compare how countries regulate personal data and run digital identity systems. They need to know where the information comes from and what its limits are.
- **Implementers and advisers** working on data protection or digital identity, who want a quick, sourced view of a country or a comparison between countries.
- **Developers and research teams** who want to run their own copy, connect their own AI provider, or adapt the tool to another topic or region.
- **Partners and reviewers** who want to understand how the tool was built and checked.

### How to use it

| If you want to... | Read |
| --- | --- |
| Understand what the tool does | [What the Policy Analyzer does](#what-the-policy-analyzer-does) |
| See how it is built | [How it is built](#how-it-is-built) |
| Know where the information comes from | [How information was collected](#how-information-was-collected) |
| Understand a country's classification | [Country indicators](#country-indicators) |
| Understand how an answer is produced | [Analysis method](#analysis-method) |
| Decide how far to rely on the results | [Verification and limitations](#verification-and-limitations) |
| Run your own copy | [Run your own instance](#run-your-own-instance) |
| Change or extend the tool | [Fork and extend](#fork-and-extend) |

### What you should take away

After reading this page you should be able to:

- describe what the Policy Analyzer does and what it does not do;
- explain how a country classification and an answer to a question are produced, and what evidence they rest on;
- judge how far to rely on the results, and what to check before you use them;
- run your own instance, connect it to your own AI provider, and extend it.

## What the Policy Analyzer does

The tool has six parts:

- **Home: continental overview.** Two interactive maps of the 55 African Union member states, one for data protection legislation and one for digital identity implementation. Filter a map by status, or click a country to see its details and sources. The page also shows headline statistics and a timeline of key milestones for each topic.
- **Sources.** A library of reference documents and research for each country, which you can browse by country and region. Each source has a short description of who published it and what kind of source it is.
- **Policy Chat.** Ask questions in plain language, in data protection or digital identity mode. Answers are written from a collection of policy documents, with web results added when the collection has too little. Your conversations are saved in your own browser.
- **Document upload.** Add a law or policy document, and choose its topic area, so that it can be searched and cited in answers.
- **Batch analysis.** Run up to 100 questions at once from a spreadsheet and receive the answers as a PDF report. You can ask to be notified by email when the report is ready.
- **Documentation.** This page.

The tool works at two levels:

- **Country indicators**: the same set of indicators is recorded for every country, so the whole continent can be compared at a glance.
- **Document analysis**: questions are answered from the text of legal and policy documents. This covers what the indicators cannot capture, such as what a law requires or how two countries' rules differ.

The analysis covers two topic areas: data protection and digital identity. Documents added without a topic are catalogued as general.

## How it is built

The Policy Analyzer is made of two applications and a few supporting services.

- **Frontend (website).** A Next.js application written in TypeScript. It draws the maps, statistics and Sources library, and it provides the chat and upload screens. It talks to the backend through an API.
- **Backend (API).** A Python application built with FastAPI. It answers questions, processes uploaded documents, runs batch jobs, and serves the country reference data.
- **Vector database (Qdrant).** Stores the passages of each document in a form that can be searched by meaning, separately for each topic area.
- **MongoDB.** Stores the country reference data, batch jobs and conversation records.
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

Before a document can be analysed, it is broken down into pieces of evidence that can be found and cited:

1. **Text extraction.** The full text is extracted from the original document.
2. **Cataloguing.** The opening part of the document is read to record the country it concerns, a title and a short description.
3. **Topic labelling.** Whoever adds the document chooses its topic area: data protection or digital identity, or general when none is chosen.
4. **Division into passages.** The text is divided into short, overlapping passages of a few paragraphs each. Every passage carries the document's country and topic labels.

As a result, each piece of evidence is a specific passage of a document rather than the document as a whole. It can be found by country and topic, and an analysis can focus on the provisions that matter for a question.

The country, title and description are detected automatically and are not manually checked, so a misreading is possible. If the country cannot be identified, the document is catalogued as "Unknown". Analyses focused on a specific country will not find it, but analyses across the whole topic can.

## Analysis method

Questions are answered by finding the relevant evidence first and then writing an answer from that evidence. The answer is not drawn from the general knowledge of an AI model alone. This approach is often called *retrieval-augmented generation*.

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
- **Policy timeline.** The timeline on the Home page presents selected milestones in data protection and digital identity across the continent, organised by year. Each entry is taken from a dated source, and figures are as reported on the date given.
- **Document-based findings.** An answer is a new synthesis of the evidence found for that question, not a stored conclusion. Rewording a question can bring up different passages and so produce a different answer. Asking questions in a fixed form, as batch analysis does, makes results easier to compare.

## Verification and limitations

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

- **Answers have not been systematically evaluated.** Answers are generated by an AI model, and their accuracy has not been formally assessed. Check the cited law or document before relying on an answer.
- **Automatic extraction is not reviewed.** The country, title and description detected for each document are not manually checked.
- **Some classifications rest on secondary sources.** Where a law was reported by news or a legal guide, it may not have been confirmed against the text of the law itself.

### Limitations to keep in mind

- **Coverage depends on the collection.** An answer can only be as complete and current as the documents it draws on. Laws are amended, and new instruments are adopted.
- **Check that the answer is about the right country.** When no evidence is found for a named country, the search widens, so an answer may draw on general material or other countries' laws. Check that the answer cites the country's own instrument.
- **Web results are not reviewed.** Answers that include web results rely on external sources the project team has not checked.
- **Indicators simplify.** One category per indicator can hide nuance, such as sector-specific rules or laws that are enacted but not yet in force. Legislation status records that a law has been enacted, not whether a regulator is operating or enforcing it. Use the reference sources to see the detail.
- **Not legal advice.** The Policy Analyzer is a research and information tool. It does not replace advice from a qualified legal professional.

## Run your own instance

The Policy Analyzer is open source under the MIT licence. Anyone can run a copy with their own documents and their own AI provider. Each repository's README has the full step-by-step instructions, and the quick start takes about 10 minutes with Docker, most of it the first build.

### What you need

- Git and Docker. Node.js 20 or newer is needed only to run the frontend without Docker.
- Access to a language model and an embedding model through an OpenAI-compatible API (see [Connect an AI gateway](#connect-an-ai-gateway)).
- A MongoDB database. The Docker setup can start one for you, along with the vector store (Qdrant) and the cache (Redis).

### Set-up in outline

1. **Start the backend.** Clone the [backend](https://github.com/cylab-africa/policy-analyzer-backend), copy `.env.example` to `.env`, set the values marked required, and start the stack with Docker Compose.
2. **Load the country data.** Run the seed script to fill the maps and the Sources page.
3. **Start the frontend.** Clone the [frontend](https://github.com/cylab-africa/policy-analyzer-frontend) and point `NEXT_PUBLIC_API_URL` at your backend. Set `NEXT_PUBLIC_API_KEY` to the same value as the backend's `API_KEY`.
4. **Add documents.** The document collection starts empty. Upload laws and policies from the chat page, choosing a topic area for each.

### Connect an AI gateway

The analysis uses two AI services: a language model, which rewrites questions and writes answers, and an embedding model, which turns passages and questions into numbers so that similar ones can be matched. Both are reached through an OpenAI-compatible API. The backend can call OpenAI directly, or a gateway that you run, such as LiteLLM, which forwards requests to other providers.

- **Direct to OpenAI.** Set `OPENAI_API_KEY` in the backend's `.env`, then run `python scripts/use_openai_models.py` once to switch the model names in `config/llm_providers.json` to OpenAI's.
- **Through a gateway.** Set `OPENAI_API_KEY` to your gateway's key and `OPENAI_BASE_URL` to its address, usually ending in `/v1`. In `config/llm_providers.json`, set the model used for each task to a name your gateway offers.
- **Changing the embedding model.** Passages indexed with one embedding model cannot be searched reliably with another. Upload the documents again after you change it.
- **Web search (optional).** Set `TAVILY_API_KEY` to enable the web search described under [Supplementary evidence](#supplementary-evidence).

Keep the keys in the backend's `.env` and out of the repository.

### Before you put it online

The default set-up shares a single API key with the browser, so anyone who can open the site can read it. Keep the admin and document-upload routes off the public internet, and restrict CORS. The backend README lists what to do before exposing an instance publicly.

## Fork and extend

You are free to fork, change and redistribute the code under the MIT licence. Where to start depends on what you want to change:

- **A different topic or region.** Edit `config/application.json` for the topic areas, `config/prompts.json` for the instructions given to the model, and `supported_tabs` in `.env`. Data protection and digital identity are also named in a few places in the code, so a new topic needs small code changes too, in the backend and in the frontend. The backend README lists them under [Adapting to another topic](https://github.com/cylab-africa/policy-analyzer-backend#adapting-to-another-topic).
- **Different models or providers.** See [Connect an AI gateway](#connect-an-ai-gateway).
- **Country indicators and sources.** The records are JSON files in `app/data` in the backend. Edit them and load them with `scripts/seed_reference_data.py --update`. Use `--dry-run` first to see what would change. The backend README explains the process.
- **The website.** Pages are in `src/app` and components in `src/components` in the frontend. This page is built from the components in `src/components/docs`, with one file for each section.
- **Running it locally or on a server.** The backend README has a Docker quick start, a local development guide and a deployment section. See [Run your own instance](#run-your-own-instance).
- **Contributing back.** Read `CONTRIBUTING.md` in each repository. Corrections to country data can be sent as a "data correction" issue. Please do not commit API keys, passwords or documents you are not allowed to redistribute.
- **Citing the tool.** Each repository includes a `CITATION.cff` file with the details to cite.

## Feedback and corrections

If you notice an error, an outdated classification or a missing document, please write to [upanzi@andrew.cmu.edu](mailto:upanzi@andrew.cmu.edu), or open an issue in the [backend](https://github.com/cylab-africa/policy-analyzer-backend/issues) or [frontend](https://github.com/cylab-africa/policy-analyzer-frontend/issues) repository. Corrections from users help keep the indicators and the document collection accurate.
