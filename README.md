# SEO Content Writer Portfolio

A static portfolio website built with plain HTML, CSS, and JavaScript,
with a built-in admin panel (Decap CMS) so you can edit everything —
text, images, portfolio items — from a login page in your browser instead
of editing code.

## How content editing works

All content (your name, bio, portfolio items, testimonials, etc.) lives
in JSON files inside the `content/` folder. The website reads those files
when it loads. The admin panel at `/admin/` is a form-based editor for
those same files — when you save a change there, it commits the update
to your GitHub repo, and Netlify automatically redeploys the site.

You can also hand-edit the JSON files directly if you prefer — either
way works.

## 1. Previewing locally

Because the site now loads content via `fetch()`, opening `index.html`
by double-clicking it will show a "could not load content" message —
browsers block that kind of file loading for security reasons. Instead,
serve the folder with a simple local server:

```bash
# from inside the project folder
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. (Or use VS Code's
"Live Server" extension the same way.) The admin panel itself
(`/admin/`) only works once deployed, since it needs Netlify Identity.

## 2. Pushing the project to GitHub

1. Create a new, empty repository on [GitHub](https://github.com) (no
   README, no .gitignore).
2. In this project folder, run:

```bash
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git push -u origin main
```

## 3. Deploying on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Click **Add new site → Import an existing project → GitHub**, and
   select your repository.
3. Leave the build command blank, publish directory `.` (already set in
   `netlify.toml`).
4. Click **Deploy site**. You'll get a live URL like
   `https://random-name-123.netlify.app`.

## 4. Turning on the admin panel (one-time setup)

The admin panel logs you in with your GitHub account directly (using
GitHub OAuth), and uses two small serverless functions already included
in this project (`netlify/functions/auth.js` and `callback.js`) to
handle the login handshake. This setup replaces Netlify's older
"Identity + Git Gateway" approach, which Netlify has deprecated.

### Step A — Create a GitHub OAuth App

1. Go to **github.com → Settings → Developer settings → OAuth Apps →
   New OAuth App** (or go directly to
   `https://github.com/settings/applications/new`).
2. Fill in:
   - **Application name:** anything, e.g. "My Portfolio Admin"
   - **Homepage URL:** your live Netlify URL, e.g.
     `https://your-site-name.netlify.app`
   - **Authorization callback URL:**
     `https://your-site-name.netlify.app/api/callback`
3. Click **Register application**.
4. Copy the **Client ID** shown on the next page.
5. Click **Generate a new client secret**, and copy that too (you won't
   be able to see it again later).

### Step B — Add the credentials to Netlify

1. In your Netlify site dashboard, go to **Site configuration →
   Environment variables**.
2. Add two variables:
   - `OAUTH_CLIENT_ID` → paste the Client ID from GitHub
   - `OAUTH_CLIENT_SECRET` → paste the Client Secret from GitHub
3. Trigger a redeploy (Netlify usually does this automatically, or use
   **Deploys → Trigger deploy → Deploy site**) so the functions can read
   the new variables.

### Step C — Point the admin panel at your repo

1. Open `admin/config.yml` in your project.
2. Replace `YOUR-USERNAME/YOUR-REPO-NAME` with your actual GitHub
   repo, e.g. `alexmorgan/alexmorgan-portfolio`.
3. Replace `https://YOUR-SITE-NAME.netlify.app` with your actual live
   Netlify URL.
4. Commit and push this change to GitHub (or edit the file directly on
   GitHub's website and commit there). Netlify redeploys automatically.

### Step D — Log in

1. Go to `https://your-site-name.netlify.app/admin/`.
2. Click **Login with GitHub**, approve access when GitHub asks.
3. You're in. Since it's your own repository, you already have the
   permissions needed to save changes.

You only need Steps A–C once. After that, editing is just:

**Visit `/admin/` → log in → click a section → edit → click Publish.**
Netlify rebuilds the site automatically within a minute or two.

## 5. What you can edit from the admin panel

| Admin section         | What it controls |
|------------------------|-------------------|
| **Site Settings**      | Your name, title, tagline, email, LinkedIn, GitHub, phone, profile photo, favicon, about text, years of experience |
| **Results / Stats**    | The stat cards (e.g. "100+ Articles Written") |
| **Skills**             | The skills list and progress bars |
| **Tools**              | The list of tools you use |
| **Portfolio Items**    | Every portfolio card — title, image, category, description, client, date, keyword, links, featured flag |
| **Websites Worked With** | The client/website logo cards |
| **Experience**         | Your work history timeline |

Each of these opens as a form. Image fields let you drag and drop a
photo directly — it's uploaded into `images/uploads/` and linked
automatically. Lists (like portfolio items or skills) have an "Add"
button to create new entries and a trash icon to remove them, and you
can drag entries to reorder them.

## 6. Linking to your Google Drive from the portfolio section

Below the portfolio grid (and the "View More Articles" button) there's an
optional call-to-action row with a short line of text and a button. It's
hidden by default. To turn it on:

1. Go to `/admin/` → **Portfolio Items** → the "Portfolio" entry.
2. Fill in **Drive CTA text** (e.g. "Want to see more of my writing?
   I keep additional samples in a shared Google Drive folder.") and
   **Drive CTA button URL** (your Drive folder's share link).
3. Click **Publish**. The row appears automatically once both fields
   have something in them; leave either blank to hide it again.

## 7. Adding a new portfolio item (example)

1. Go to `/admin/` → **Portfolio Items** → the one "Portfolio" entry.
2. Click **Add** under Items.
3. Fill in the title, upload or paste an image, pick a category, write
   the description, and add either a live article URL or a Google Doc
   link (or both). Toggle "Show in Featured section" if you want it in
   the featured area near the top of the page.
4. Click **Publish**. The live site updates within a minute or two.

For a Google Doc sample, set its sharing to **Anyone with the link —
Viewer** so visitors can actually open it.

## 8. Replacing your profile photo and resume

- **Profile photo:** in **Site Settings**, click the profile photo field
  and upload your own image. No code changes needed.
- **Resume:** the admin panel doesn't manage PDFs, so replace it
  directly — put your file at `resume/resume.pdf` in the repo (via
  GitHub's web upload, or `git add`/`commit`/`push` locally), keeping
  that exact file name. The "Download Resume" buttons already point to
  that path.

## 9. Editing content by hand (optional)

If you'd rather skip the admin panel, everything it edits lives in
plain JSON files in `content/`:

```
content/settings.json       Name, bio, contact info, about text
content/stats.json          Stat cards
content/skills.json         Skills list
content/tools.json          Tools list
content/portfolio.json      Portfolio items
content/websites.json       Websites worked with
content/experience.json     Work experience
```

Open any of them in a text editor, change the values (keep the quotes
and commas intact), save, and push to GitHub. Netlify redeploys
automatically.

## 10. Contact form (Netlify Forms)

The contact form already has the attributes Netlify needs
(`data-netlify="true"`), and submits via a small AJAX request so the
page doesn't reload. Once deployed, submissions appear in your Netlify
dashboard under **Forms** — no extra setup required.

## 11. Dark mode

The moon/sun icon in the navigation toggles dark mode, saved in the
visitor's browser so it's remembered on their next visit.

## Project structure

```
/index.html                 Main page (all sections)
/css/style.css                All styling
/js/script.js                  Loads content JSON and renders the page
/content/                      All editable site content (JSON)
/admin/index.html               Admin panel (Decap CMS)
/admin/config.yml                Defines what's editable in the admin panel
/images/profile/                 Your profile photo goes here
/images/uploads/                  Images uploaded via the admin panel land here
/resume/                          Your resume.pdf goes here
/robots.txt
/sitemap.xml
/netlify.toml
/README.md
```

## Notes

- **Favicon:** put a square image at `images/favicon/favicon.png` whenever
  you're ready, or upload one from **Site Settings → Favicon** in the
  admin panel (that one takes priority if set). No code changes needed
  either way.
- Before you finish setup, replace the `your-domain-here.netlify.app`
  placeholders in `index.html`, `robots.txt`, and `sitemap.xml` with
  your real Netlify URL.
- The site uses free Google Fonts (Fraunces + Work Sans) and, until you
  replace them, placeholder images from `picsum.photos`.
- No npm install or build step is required — it's a static site that
  works as-is once content and the admin panel are set up.
