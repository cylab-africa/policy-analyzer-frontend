# Security Policy

This policy covers both the [Policy Analyzer backend](https://github.com/cylab-africa/policy-analyzer-backend) and the [Policy Analyzer frontend](https://github.com/cylab-africa/policy-analyzer-frontend).

## Reporting a vulnerability

**Please do not report security vulnerabilities in public issues, pull requests or discussions.**

Report them privately by either:

- using GitHub's private vulnerability reporting: open the **Security** tab of the affected repository and choose **Report a vulnerability**; or
- emailing [upanzi@andrew.cmu.edu](mailto:upanzi@andrew.cmu.edu) with the subject line `Security: <repository name>`.

Please include:

- a description of the problem and its potential impact;
- steps to reproduce it, or a proof of concept;
- the affected component, version or commit;
- how to reach you, if you would like updates.

Please test only against your own instance. Do not access, change or delete data that belongs to other people, and do not run denial-of-service or automated scanning tests against any deployment you do not operate.

## What to expect

We aim to acknowledge reports within 5 working days and to keep you informed as we investigate and fix the problem. With your permission, we will credit you when the fix is released.

## Supported versions

Only the latest code on the `main` branch is supported.

## Out of scope

- Vulnerabilities in third-party dependencies with no demonstrated impact on this project (please report those upstream).
- Findings about a deployment that this project does not operate.
- Social engineering and physical attacks.

## Running your own instance

- The backend is protected by a single shared API key. The frontend keeps that key on its server (`BACKEND_API_KEY`) and adds it to requests through its `/api/backend` proxy, so it is not sent to browsers. The proxy does not identify visitors, though: anyone who can load the site can use it. Read [Before exposing an instance publicly](https://github.com/cylab-africa/policy-analyzer-backend#before-exposing-an-instance-publicly) before putting an instance on the internet.
- Never commit `.env` files, API keys or credentials.
