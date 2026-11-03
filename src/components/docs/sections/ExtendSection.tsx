import { docMeta, anchor } from "../meta";
import { A, Code, DocSection, DocTable, P, REPOS } from "../primitives";

export function ExtendSection() {
    return (
        <DocSection title={docMeta.extend.title}>
            <P>
                The code is released under the MIT licence, so you may copy it, change it and share it, including in
                your own projects. Where to start depends on what you want to change:
            </P>
            <DocTable
                head={["If you want to...", "Do this"]}
                rows={[
                    [
                        "Use a different AI provider or model",
                        <>
                            Follow <A href={anchor(docMeta.run.parts.gateway)}>{docMeta.run.parts.gateway}</A>. No code
                            changes are needed.
                        </>,
                    ],
                    [
                        "Change or add country data",
                        "The country records are plain data files in the backend. Edit them, then load them again with the setup script. The backend README explains the steps.",
                    ],
                    [
                        "Cover a different topic or region",
                        <>
                            This is possible but takes more work, because a few settings files and places in the code
                            mention data protection and digital identity. The backend README lists them under{" "}
                            <A href={`${REPOS.backend}#adapting-to-another-topic`}>Adapting to another topic</A>.
                        </>,
                    ],
                    [
                        "Change how the website looks",
                        <>
                            The pages and components are in the <Code>src</Code> folder of the frontend. This
                            documentation is built from the files in <Code>src/components/docs</Code>, one for each
                            section.
                        </>,
                    ],
                    [
                        "Share your improvements",
                        <>
                            Read <Code>CONTRIBUTING.md</Code> in each repository. To report wrong country data, open a
                            “data correction” issue. Never commit API keys, passwords or documents you are not allowed
                            to share.
                        </>,
                    ],
                ]}
            />
            <P>
                To cite the tool, use the <Code>CITATION.cff</Code> file in each repository.
            </P>
        </DocSection>
    );
}
