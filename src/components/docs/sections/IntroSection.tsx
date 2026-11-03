import { A, P, REPOS } from "../primitives";

export function IntroSection() {
    return (
        <P>
            The Policy Analyzer is an open-source web tool for exploring and comparing data protection and digital
            identity policy across Africa. This page documents the whole tool: what it is for, what it does, how it was
            built, how its information was collected and checked, how its results are produced, and how to run or extend
            your own copy. The source code is on GitHub, in two repositories: the <A href={REPOS.backend}>backend</A>{" "}
            and the <A href={REPOS.frontend}>frontend</A>.
        </P>
    );
}
