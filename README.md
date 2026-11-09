# n3Xm@R

**One goal. Too many side quests.**

[**n3xmar.space**](https://n3xmar.space)

Hey, I'm Ammar, a cybersecurity student from Jordan.

I like pentesting, Linux, CTFs, and building random things that have absolutely nothing to do with what I was supposed to be doing.

This is my little space on the internet. Part portfolio, part collection of things I've learned, built, broken, or just found interesting.

## What's here?

- **Projects** - Things I've built, including Sponge (my Linux homelab), GhostPass, and 404! Timer.
- **Rabbit Holes** - CTF writeups, book reviews, and whatever else catches my attention.
- **Currently** - My main quest and a couple of side quests.
- **Certificates** - Some learning milestones along the way.
- **The Log** - A simple record of things I've done. No long explanations.

There are a few other things hidden around the site. Try the terminal if you're curious.

## Under the Hood

The site is built with:

- **Astro** for the static site.
- **HTML, CSS, and JavaScript/TypeScript** for the interface and interactive bits.
- **Markdown** for projects, writeups, and other content.
- **Pages CMS** for editing content through GitHub.
- **GitHub Pages** for hosting and deployment.

No backend or database needed.

---

Made with curiosity, not a plan.

## Editing content

Most updates should be made in **Pages CMS**, not in page templates. Its settings are in `.pages.yml`.

- Projects, Rabbit Holes, and Certificates are Markdown collections under `src/content/`.
- The Log is a single JSON list in `src/data/log.json`; you can add a record through CMS without creating a Markdown file.
- Maybe and Currently are JSON files under `src/data/`.
- Photos and screenshots are stored under `public/images/`, grouped by project or article.

See [MAINTENANCE.md](docs/MAINTENANCE.md) for the site map, CMS workflow, image conventions, build commands, and troubleshooting steps.

## Local development

```bash
npm ci
npm run dev
npm run build
```
