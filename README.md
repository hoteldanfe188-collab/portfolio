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

The admin panel needs two things enabled in Netlify: **Identity** (so you
can log in) and **Git Gateway** (so it can save changes to GitHub).

1. In your Netlify site dashboard, go to **Site configuration → Identity**
   and click **Enable Identity**.
2. Still in Identity settings, scroll to **Registration** and set it to
   **Invite only** (so strangers can't sign up on your site).
3. Scroll to **Services → Git Gateway** and click **Enable Git Gateway**.
   This lets the CMS commit content changes to your repo on your behalf.
4. Go to the **Identity** tab (top of your site dashboard, not settings)
   and click **Invite users**. Enter your own email address.
5. Check your email for the invite, click it — it will open your site
   and prompt you to set a password.
6. Go to `https://your-site.netlify.app/admin/` and log in with that
   email and password.

You only need to do this setup once. After that, editing is just:

**Visit `/admin/` → log in → click a section → edit → click Publish.**
Netlify rebuilds the site automatically within a minute or two.

## 5. What you can edit from the admin panel

| Admin section         | What it controls |
|------------------------|-------------------|
| **Site Settings**      | Your name, title, tagline, email, LinkedIn, GitHub, phone, profile photo, about text, years of experience |
| **Results / Stats**    | The stat cards (e.g. "100+ Articles Written") |
| **Skills**             | The skills list and progress bars |
| **Tools**              | The list of tools you use |
| **Portfolio Items**    | Every portfolio card — title, image, category, description, client, date, keyword, links, featured flag |
| **Websites Worked With** | The client/website logo cards |
| **Experience**         | Your work history timeline |
| **Testimonials**       | Client/employer quotes and photos |

Each of these opens as a form. Image fields let you drag and drop a
photo directly — it's uploaded into `images/uploads/` and linked
automatically. Lists (like portfolio items or skills) have an "Add"
button to create new entries and a trash icon to remove them, and you
can drag entries to reorder them.

## 6. Adding a new portfolio item (example)

1. Go to `/admin/` → **Portfolio Items** → the one "Portfolio" entry.
2. Click **Add** under Items.
3. Fill in the title, upload or paste an image, pick a category, write
   the description, and add either a live article URL or a Google Doc
   link (or both). Toggle "Show in Featured section" if you want it in
   the featured area near the top of the page.
4. Click **Publish**. The live site updates within a minute or two.

For a Google Doc sample, set its sharing to **Anyone with the link —
Viewer** so visitors can actually open it.

## 7. Replacing your profile photo and resume

- **Profile photo:** in **Site Settings**, click the profile photo field
  and upload your own image. No code changes needed.
- **Resume:** the admin panel doesn't manage PDFs, so replace it
  directly — put your file at `resume/resume.pdf` in the repo (via
  GitHub's web upload, or `git add`/`commit`/`push` locally), keeping
  that exact file name. The "Download Resume" buttons already point to
  that path.

## 8. Editing content by hand (optional)

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
content/testimonials.json   Testimonials
```

Open any of them in a text editor, change the values (keep the quotes
and commas intact), save, and push to GitHub. Netlify redeploys
automatically.

## 9. Contact form (Netlify Forms)

The contact form already has the attributes Netlify needs
(`data-netlify="true"`), and submits via a small AJAX request so the
page doesn't reload. Once deployed, submissions appear in your Netlify
dashboard under **Forms** — no extra setup required.

## 10. Dark mode

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

- Before you finish setup, replace the `your-domain-here.netlify.app`
  placeholders in `index.html`, `robots.txt`, and `sitemap.xml` with
  your real Netlify URL.
- The site uses free Google Fonts (Fraunces + Work Sans) and, until you
  replace them, placeholder images from `picsum.photos`.
- No npm install or build step is required — it's a static site that
  works as-is once content and the admin panel are set up.
