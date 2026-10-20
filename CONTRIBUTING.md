# Contributing to the Policy Analyzer frontend

Thank you for your interest in improving the Policy Analyzer. Everyone taking part in this project is expected to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report a bug** or **suggest a feature** by opening an issue.
- **Correct the content.** If a map classification, a source link or a statement on the Documentation page is wrong, outdated or missing, open a *Data or content correction* issue and link to the primary source (for example the official gazette).
- **Improve the documentation**, including the README and the Documentation page.
- **Fix a bug or build a feature** with a pull request.

To report a security problem, do not open an issue. Follow [SECURITY.md](SECURITY.md).

## Before you start

For anything larger than a small fix, please open an issue first to discuss the approach. This avoids wasted effort if the change doesn't fit the project's direction.

## Setting up

Follow the [Quick start](README.md#quick-start) in the README. The app needs the [backend](https://github.com/cylab-africa/policy-analyzer-backend) running for the maps, Sources and chat.

## Making a change

1. Fork the repository and create a branch from `main`, such as `fix/short-description` or `feature/short-description`.
2. Keep the change focused. Separate unrelated changes into separate pull requests.
3. Before opening a pull request, run `npm run lint` and `npm run build`. Both must pass.
4. For visual changes, check the page at phone (about 375 px), tablet (about 768 px) and desktop (about 1280 px) widths, and include a screenshot in the pull request.
5. Open a pull request against `main` and fill in the template.

## Guidelines

- **No secrets.** Never commit `.env` files or credentials. Everything prefixed `NEXT_PUBLIC_` is visible to every visitor of the site.
- **Accessibility.** Use semantic HTML, keep everything usable with a keyboard, give images text alternatives, and keep text readable against its background.
- **Documentation page text.** The text lives in [`src/content/documentation.md`](src/content/documentation.md). Describe only what the system actually does, and don't claim verification or evaluation that hasn't been done. Changes to how the analysis is described should say which behavior they reflect.
- **Reference data.** Changes to the country data in `src/data/` need a link to a primary source.
- **Existing components.** Prefer the components in `src/components/ui/` and the existing Tailwind styling over adding new libraries.
- **Style.** Match the surrounding code.

## Licensing of contributions

By submitting a contribution you agree that it is released under the project's [MIT License](LICENSE).
