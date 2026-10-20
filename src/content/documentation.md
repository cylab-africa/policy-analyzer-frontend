The Policy Analyzer studies data protection and digital identity policy across African countries. This page describes the method behind it: what is measured, what evidence it relies on, how information is extracted from policy documents, how questions are analysed, and the limits of the results.

## Purpose and scope

The Policy Analyzer helps researchers, policy analysts and implementers compare how African countries regulate personal data and implement digital identity systems. It works at two levels:

- **Country indicators**: the same set of indicators is recorded for every country, so the whole continent can be compared at a glance.
- **Document analysis**: questions are answered from the text of policy documents. This covers what the indicators cannot capture, such as what a law requires or how two countries' rules differ.

The analysis covers three topic areas: data protection, digital identity, and general legal and regulatory questions in the same field.

## Analytical framework

The country indicators give a consistent basis for comparison. Each country is placed in exactly one category for each indicator, so countries can be counted, mapped and compared. The maps follow African Union membership: they show all 55 member states, with Western Sahara drawn as the Sahrawi Arab Democratic Republic and Somaliland shown as part of Somalia. Boundaries come from Natural Earth and are drawn for overview, not as an authoritative boundary reference.

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
- **Descriptive attributes**, where available: the issuing authority, the year the system was launched, a coverage figure, its main features and a short description. The coverage figure estimates how many people the system covers, and it is often reported by the issuing authority itself. It reads "Unknown" where no figure was found and "Not yet launched" for systems that are still being planned.

Categories such as "limited framework" or "partially implemented" involve judgement. A single category cannot capture every nuance of a country's situation. Country records were last updated in October 2026, and ID programmes in particular change quickly.

## Evidence base

The analysis relies on two separate bodies of evidence.

### Reference sources for the indicators

Each country record lists reference material so that any classification can be checked against published sources. This includes country fact sheets, legal guides, the text of laws where we have found it, government and official sources, academic and policy research, reports by development partners and research institutes, and news reports on recent developments. All of it is collected in the **Sources** library, where readers can browse it by country and region.

### Document collection for analysis

Document-level analysis draws on a collection of policy documents, including laws, regulations and frameworks, organised by topic area. The Sources library is a reading list for checking and further study. The document collection is what the analysis actually searches.

## Information extraction

Before a document can be analysed, it is broken down into pieces of evidence that can be found and cited:

1. **Text extraction.** The full text is extracted from the original document.
2. **Cataloguing.** The opening part of the document is read to record the country it concerns, a title and a short description.
3. **Topic labelling.** The document is assigned to its topic area: data protection, digital identity or general.
4. **Division into passages.** The text is divided into short, overlapping passages of a few paragraphs each. Every passage carries the document's country and topic labels.

As a result, each piece of evidence is a specific passage of a document rather than the document as a whole. It can be found by country and topic, and an analysis can focus on the provisions that matter for a question.

If the country cannot be identified, the document is catalogued as "Unknown". Analyses focused on a specific country will not find it, but analyses across the whole topic can.

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

If very little evidence is found, or the question asks about recent or current developments, the analysis also runs a web search. Answers that use web results include a note saying so.

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
- **Policy timeline.** The timeline on the Home page presents selected milestones in data protection and digital identity across the continent, organised by year.
- **Document-based findings.** An answer is a new synthesis of the evidence found for that question, not a stored conclusion. Rewording a question can bring up different passages and so produce a different answer. Asking questions in a fixed form, as batch analysis does, makes results easier to compare.

## Quality and limitations

Several checks are built into the method:
- questions outside the analyser's scope are declined;
- answers are instructed to rely on the evidence found and to say when it is insufficient;
- answers that draw on web results are labelled.

Keep the following limitations in mind:

- **Answers have not been systematically evaluated.** Answers are generated by an AI model, and their accuracy has not been formally assessed. Check the cited law or document before relying on an answer.
- **Coverage depends on the collection.** An answer can only be as complete and current as the documents it draws on. Laws are amended, and new instruments are adopted.
- **Check that the answer is about the right country.** When no evidence is found for a named country, the search widens, so an answer may draw on general material or other countries' laws. Check that the answer cites the country's own instrument.
- **Web results are not reviewed.** Answers that include web results rely on external sources the project team has not checked.
- **Indicators simplify.** One category per indicator can hide nuance, such as sector-specific rules or laws that are enacted but not yet in force. Legislation status records that a law has been enacted, not whether a regulator is operating or enforcing it. Use the reference sources to see the detail.
- **Not legal advice.** The Policy Analyzer is a research and information tool. It does not replace advice from a qualified legal professional.

## Feedback and corrections

If you notice an error, an outdated classification or a missing document, please write to [upanzi@andrew.cmu.edu](mailto:upanzi@andrew.cmu.edu). Corrections from users help keep the indicators and the document collection accurate.
