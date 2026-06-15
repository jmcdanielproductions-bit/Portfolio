# Git Push Recovery Reference

Use this when Git cannot connect, cannot prompt for credentials, or a commit was prepared in a temporary clone.

## Quick Status Check

From the repo or temp clone:

```powershell
git status --short --branch
git remote -v
git rev-parse HEAD
git -c http.sslBackend=openssl ls-remote origin refs/heads/main
```

What to look for:

- `git status` says `[ahead 1]`: the commit exists locally but is not pushed.
- `rev-parse HEAD` and `ls-remote ... refs/heads/main` match: GitHub has the commit.
- `ls-remote` shows an older SHA: GitHub has not received the commit yet.

## If Git Says Dubious Ownership

If Git reports `detected dubious ownership`, trust only that exact folder:

```powershell
git config --global --add safe.directory C:/Users/cyber/AppData/Local/Temp/portfolio-kairi-push-311e886ba6ec4afcb16d106205c2b72f
```

Then `cd` back into that folder before running Git commands:

```powershell
cd C:\Users\cyber\AppData\Local\Temp\portfolio-kairi-push-311e886ba6ec4afcb16d106205c2b72f
git status --short --branch
git remote -v
```

## Push From The Prepared Temp Clone

```powershell
cd C:\Users\cyber\AppData\Local\Temp\portfolio-kairi-push-311e886ba6ec4afcb16d106205c2b72f
git push origin main
```

Successful output looks like this:

```text
To https://github.com/jmcdanielproductions-bit/Portfolio.git
   OLD_SHA..NEW_SHA  main -> main
```

Then verify:

```powershell
git -c http.sslBackend=openssl ls-remote origin refs/heads/main
```

## If Push Hangs Or Auth Fails

Clear stuck Git credential processes:

```powershell
Get-Process git,git-remote-https,git-credential-manager,GitCredentialManager -ErrorAction SilentlyContinue | Stop-Process -Force
```

Then authenticate GitHub for Git, not just the browser. After signing in, retry:

```powershell
git push origin main
```

## Reusable Prompt For Codex

```text
Git push recovery needed. Please check whether my prepared commit is pushed to GitHub. Compare local HEAD with `git -c http.sslBackend=openssl ls-remote origin refs/heads/main`, handle any `safe.directory` issue, clear stuck Git/GCM processes if needed, and push `main` from the prepared temp clone without touching unrelated dirty files in my main workspace. Do not use destructive git commands. After pushing, confirm the remote branch SHA matches the prepared commit SHA.
```
