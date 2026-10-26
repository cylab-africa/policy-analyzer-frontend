import { docMeta } from "../meta";
import { B, DocSection, LI, P, UL } from "../primitives";

export function BuiltSection() {
    return (
        <DocSection title={docMeta.built.title}>
            <P>The Policy Analyzer is made of two applications and a few supporting services.</P>
            <UL>
                <LI>
                    <B>Frontend (website).</B> A Next.js application written in TypeScript. It draws the maps,
                    statistics and Sources library, and it provides the chat and upload screens. It talks to the
                    backend through an API.
                </LI>
                <LI>
                    <B>Backend (API).</B> A Python application built with FastAPI. It answers questions, processes
                    uploaded documents, runs batch jobs, and serves the country reference data.
                </LI>
                <LI>
                    <B>Vector database (Qdrant).</B> Stores the passages of each document in a form that can be
                    searched by meaning, separately for each topic area.
                </LI>
                <LI>
                    <B>MongoDB.</B> Stores the country reference data, batch jobs and conversation records.
                </LI>
                <LI>
                    <B>Redis.</B> A cache that keeps the results of repeated questions.
                </LI>
                <LI>
                    <B>AI provider.</B> The analysis uses a language model and an embedding model, reached through an
                    OpenAI-compatible API. This can be OpenAI directly or an AI gateway you run.
                </LI>
                <LI>
                    <B>Optional services.</B> A web search service for recent developments, an email server for batch
                    notifications, and Amazon S3 for storing uploaded files.
                </LI>
            </UL>

            <P>Four design choices shape the tool:</P>
            <UL>
                <LI>
                    <B>Answers come from documents.</B> The tool finds the relevant passages first and then writes an
                    answer from them, instead of relying on the general knowledge of an AI model.
                </LI>
                <LI>
                    <B>Topics, prompts and models are mostly configuration.</B> They are set in configuration files
                    rather than buried in the code. The two current topics are also named in a few places in the
                    code, so pointing the tool at another subject needs small code changes as well.
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
