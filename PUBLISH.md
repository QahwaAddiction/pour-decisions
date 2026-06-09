# Publishing Pour Decisions

Two ways to get this on GitHub and live on the web. Pick **A** (no command line)
if you're not comfortable in a terminal.

---

## A. The easy way — GitHub website (no command line)

### 1. Create the repository
1. Go to https://github.com/new
2. **Repository name:** `pour-decisions`
3. Leave it **Public**. Do **not** add a README, .gitignore, or license
   (this project already has them).
4. Click **Create repository**.

### 2. Upload the files
1. On the new repo page, click **uploading an existing file**
   (the link in "…or upload an existing file").
2. Open the `pour-decisions` folder on your computer, select **everything
   inside it** (including the `public`, `src`, and `.github` folders), and
   drag it all into the browser.
   - If the `.github` folder won't drag, that's fine — see the note below.
3. Scroll down, click **Commit changes**.

> **Note on the `.github` folder:** browsers sometimes skip folders that start
> with a dot. If the auto-deploy workflow didn't upload, create it by hand:
> click **Add file → Create new file**, type
> `.github/workflows/deploy.yml` as the name (the slashes make the folders),
> paste in the contents of the local `deploy.yml`, and commit.

### 3. Turn on the live website
1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Wait ~1–2 minutes. Your app goes live at:
   `https://<your-username>.github.io/pour-decisions/`

Every time you change a file and commit, the site rebuilds itself.

---

## B. The command-line way (if you have git installed)

From inside the `pour-decisions` folder:

```bash
git init
git add .
git commit -m "Initial commit: Pour Decisions"
git branch -M main
git remote add origin https://github.com/<your-username>/pour-decisions.git
git push -u origin main
```

Then do **step 3** above (Settings → Pages → Source: GitHub Actions).

---

## Running it on your own computer first (optional)

If you want to see it locally before publishing, install
[Node.js](https://nodejs.org) (LTS version), then in the `pour-decisions` folder:

```bash
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173).

---

## Installing it on your phone

Once it's live, open the GitHub Pages URL on your phone:
- **iPhone (Safari):** Share button → **Add to Home Screen**
- **Android (Chrome):** menu (⋮) → **Install app** / **Add to Home Screen**

It installs with the coffee icon and runs full-screen, just like a native app.
