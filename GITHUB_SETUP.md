# GitHub handoff

The repository is already initialized on `main`. Application behavior was not changed for this cleanup.

## Before committing

- Keep all API keys in server environment variables. Never paste credentials into JavaScript or HTML.
- `.gitignore` excludes `.env` files, private keys, local hosting metadata, downloaded Blender binaries, local presentations, build copies and machine-specific helpers.
- The local `Keep-Busola-Running.ps1` helper is intentionally excluded because it contains a machine-specific path. On a new clone, start the portable server with `node serve.mjs` and open `http://127.0.0.1:8080/`. The existing Windows launcher depends on that local helper.
- `assets/semiconductor.blend`, the exported GLB, web assets, backend source and `tools/verify.mjs` remain part of the project.
- Review new files before each commit: ignore rules cannot detect a secret pasted into an otherwise legitimate source file.
- The original commit includes a Sites project identifier in `.openai/hosting.json`. This is account metadata, not an API credential. It is removed from the current index but remains in existing history; history has not been rewritten.

## Push to a new GitHub repository

Create an empty repository on GitHub (prefer private until brand and data sharing are approved). Do not initialize it with a README or license.

In PowerShell, from this project directory:

```powershell
git status --short
git add .
git diff --cached --stat
git diff --cached
git commit -m "Prepare Busola project for GitHub"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the URL with your repository URL. Authenticate using Git Credential Manager or GitHub's browser sign-in; do not embed a token in the URL. An existing `sites` remote is separate and has not been changed. If `origin` already exists, inspect it before deciding whether to use `git remote set-url origin YOUR_URL`.

No new commit or GitHub push was performed during preparation. Existing Git history was preserved. If a real credential is ever found in history, revoke it first; deleting the current file alone does not remove historical exposure.
