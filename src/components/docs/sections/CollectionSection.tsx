import { docMeta } from "../meta";
import { B, DocSection, DocSubsection, P } from "../primitives";

const { title, parts } = docMeta.collection;

export function CollectionSection() {
    return (
        <DocSection title={title}>
            <P>The tool relies on two separate bodies of evidence.</P>

            <DocSubsection title={parts.reference}>
                <P>
                    Most country records list reference material so that the classification can be checked against
                    published sources. This includes country fact sheets, legal guides, the text of laws where we have
                    found it, government and official sources, academic and policy research, reports by development
                    partners and research institutes, and news reports on recent developments. All of it is collected in
                    the <B>Sources</B> library, where readers can browse it by country and region.
                </P>
                <P>
                    In practice, every data protection record cites a country fact sheet from Data Protection Africa
                    (ALT Advisory). Some also cite DLA Piper’s overview of the country’s law, and for a few countries
                    the text of the law itself is linked. Malabo Convention status follows the African Union’s official
                    status list, updated with later ratifications reported in the news. Digital identity records cite
                    World Bank ID4D diagnostics and other development-partner reports, research from organisations such
                    as ECDPM, DiploFoundation and Research ICT Africa, and news reports on recent developments. Some
                    digital identity records do not yet list a source. Most of these sources summarise the law rather
                    than replace it, so check the law itself for anything you rely on.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.documents}>
                <P>
                    Document-level analysis draws on a collection of policy documents, including laws, regulations and
                    frameworks, organised by topic area. The collection is made of the texts of national legal
                    instruments, such as data protection laws, added through the project’s upload tools. The Sources
                    library is a reading list for checking and further study. The document collection is what the
                    analysis actually searches.
                </P>
                <P>
                    The collection is not a complete register of African law. It holds the documents that have been
                    uploaded so far, and an answer can only reflect those documents, plus web results where they are
                    used.
                </P>
            </DocSubsection>

            <DocSubsection title={parts.current}>
                <P>
                    The country indicators are recorded by hand by the project team. They are not generated
                    automatically from the document collection, and no automatic rule assigns a category. The records
                    are kept in the project’s code repository, so changes to them can be traced. Documents are added to
                    the collection through the upload tools.
                </P>
            </DocSubsection>
        </DocSection>
    );
}
