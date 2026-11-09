# n3xmar.space — site maintenance guide

This project is a static Astro portfolio, hosted on GitHub Pages and edited using **Pages CMS**. The visual design is intentionally stable. For normal updates, change content via the CMS; do not edit page templates.

## Directory map

| File or folder | Responsibility |
| --- | --- |
| `.pages.yml` | Pages CMS collections, fields, and media upload locations |
| `src/pages/` | The real site routes (Home, Log, Maybe, Projects, Rabbit Holes, Certificates) |
| `src/layouts/` | Reusable archive and article layouts |
| `src/components/SiteHead.astro` | SEO metadata, canonical URL, favicon and cat script |
| `src/scripts/music.ts` | Music-player behavior |
| `src/scripts/terminal.ts` | Interactive terminal and three-flag mini CTF |
| `src/scripts/certificate-modal.ts` | Certificate dialog, shared across both listing pages |
| `src/scripts/certificate-filters.ts` | Certificate category filter |
| `src/styles/style.css` | Site-wide design tokens and visual rules |
| `src/content/projects/` | Full project Markdown pages |
| `src/content/rabbit-holes/` | Writeups, articles, events, and book reviews |
| `src/content/certificates/` | Certificate metadata and descriptions |
| `src/data/log.json` | Short activity records in a single JSON array |
| `src/data/maybe.json` | Ideas list, one JSON array |
| `src/data/currently.json` | Main quest and two side quests |
| `public/images/projects/<project>/` | Images belonging to each project |
| `public/images/rabbit-holes/<article>/` | Screenshots and photos for each article |
| `public/images/certificates/` | Certificate images |
| `.github/workflows/deploy.yml` | GitHub Pages build and deployment |

## How content editing works

Go to your Pages CMS dashboard connected to this repository. The available content sections are:

- **Rabbit Holes:** new Markdown document per article. The article body supports headings, images and code blocks.
- **Projects:** new Markdown document per project, including date, description, tags, cover and optional GitHub URL.
- **Certificates:** one Markdown document per certificate; the body provides additional details shown in the modal.
- **The Log:** a simple editable **list**, stored in `src/data/log.json`. Adding one event must not create a separate `.md` file.
- **Currently:** edit main and two side quests in `src/data/currently.json`.
- **Maybe, Someday:** edit the list in `src/data/maybe.json`; completed ideas may have a link.

Each CMS save writes to GitHub and triggers the Pages workflow. Separate image uploads and edits may produce separate commits; that is expected, not a sign of a broken repository.

### Log data

A record looks like this:

```json
{
  "date": "2026-07-25",
  "category": "event",
  "title": "Attended HTB Jordan Meetup"
}
```

Optional `link` values should be valid full URLs or internal paths beginning with `/`. Categories: `event`, `project`, `learning`, `milestone`. Entries are displayed newest-first and grouped by calendar year.

## Image organization

Existing project images are under `public/images/projects/<project>/`, and article images under `public/images/rabbit-holes/<article>/`. The CMS media pickers still use their respective **parent folders** as upload roots, which means newly uploaded files may appear at the root until organized. For a batch of images, upload and organize them through Git in one commit.

Examples:

- `/images/projects/ghostpass/ghostpass-cli.png`
- `/images/rabbit-holes/pickle-rick/pickle-rick-login.png`

Changing an image's location requires updating the matching Markdown links. Preserve the case of image extensions and filenames. For photographs, resize and compress large originals before upload; for terminal screenshots, prioritize text readability.

## How to run it locally

Requirements: supported Node.js version specified in `package.json`, npm.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The site has no database or backend. Astro loads content at build time. Content schemas live in `src/content.config.ts`; when changing them, keep `.pages.yml` in sync.

## Features to preserve

- Industrial dark colors, typography, and the site identity.
- Homepage quest cards, projects, Rabbit Holes, certificates and footer.
- The cat, optional music control, and interactive terminal.
- The mini CTF's three intentional browser-discovery flags. Its cookie and localStorage values are part of the game and are **not** authentication.
- Published article URLs. Renaming Markdown entries can change generated URLs.

## Troubleshooting

1. **Content not updated?** Inspect the latest Actions run and CMS commit.
2. **Broken screenshot?** Check path and case in both `public/` and the Markdown file.
3. **Build failed?** Check the YAML frontmatter, collection schema and Actions build log.
4. **CMS field missing?** Edit `.pages.yml` and confirm the corresponding data schema.
5. **Changes unexpectedly break layout?** Revert the specific refactoring commit; avoid resetting unrelated content edits.

The source of truth for content is the repository; Pages CMS is the editing interface.
