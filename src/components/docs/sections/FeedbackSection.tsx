import { docMeta } from "../meta";
import { A, CONTACT_EMAIL, DocSection, P, REPOS } from "../primitives";

export function FeedbackSection() {
    return (
        <DocSection title={docMeta.feedback.title}>
            <P>
                If you notice an error, an outdated classification or a missing document, please write to{" "}
                <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>, or open an issue in the{" "}
                <A href={`${REPOS.backend}/issues`}>backend</A> or <A href={`${REPOS.frontend}/issues`}>frontend</A>{" "}
                repository. Corrections from users help keep the indicators and the document collection accurate.
            </P>
        </DocSection>
    );
}
