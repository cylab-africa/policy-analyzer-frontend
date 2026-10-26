import { docMeta, anchor } from "../meta";
import { A, B, Code, DocSection, LI, P, REPOS, UL } from "../primitives";

export function ExtendSection() {
    return (
        <DocSection title={docMeta.extend.title}>
            <P>
                You are free to fork, change and redistribute the code under the MIT licence. Where to start depends
                on what you want to change:
            </P>
            <UL>
                <LI>
                    <B>A different topic or region.</B> Edit <Code>config/application.json</Code> for the topic
                    areas, <Code>config/prompts.json</Code> for the instructions given to the model, and{" "}
                    <Code>supported_tabs</Code> in <Code>.env</Code>. Data protection and digital identity are also
                    named in a few places in the code, so a new topic needs small code changes too, in the backend
                    and in the frontend. The backend README lists them under{" "}
                    <A href={`${REPOS.backend}#adapting-to-another-topic`}>Adapting to another topic</A>.
                </LI>
                <LI>
                    <B>Different models or providers.</B> See{" "}
                    <A href={anchor(docMeta.run.parts.gateway)}>{docMeta.run.parts.gateway}</A>.
                </LI>
                <LI>
                    <B>Country indicators and sources.</B> The records are JSON files in <Code>app/data</Code>{" "}
                    in the backend. Edit them and load them with{" "}
                    <Code>scripts/seed_reference_data.py --update</Code>. Use <Code>--dry-run</Code> first to
                    see what would change. The backend README explains the process.
                </LI>
                <LI>
                    <B>The website.</B> Pages are in <Code>src/app</Code> and components in{" "}
                    <Code>src/components</Code> in the frontend. This page is built from the components in{" "}
                    <Code>src/components/docs</Code>, with one file for each section.
                </LI>
                <LI>
                    <B>Running it locally or on a server.</B> The backend README has a Docker quick start, a local
                    development guide and a deployment section. See{" "}
                    <A href={anchor(docMeta.run.title)}>{docMeta.run.title}</A>.
                </LI>
                <LI>
                    <B>Contributing back.</B> Read <Code>CONTRIBUTING.md</Code> in each repository. Corrections
                    to country data can be sent as a “data correction” issue. Please do not commit API keys,
                    passwords or documents you are not allowed to redistribute.
                </LI>
                <LI>
                    <B>Citing the tool.</B> Each repository includes a <Code>CITATION.cff</Code> file with the
                    details to cite.
                </LI>
            </UL>
        </DocSection>
    );
}
