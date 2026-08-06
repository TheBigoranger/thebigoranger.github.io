# Yicheng Xu — Academic Portfolio

Personal academic website for **Yicheng Xu** (Ph.D. student, UC Irvine), built with [Astro](https://astro.build/).

**Live site:** [https://www.ethanyxu.com](https://www.ethanyxu.com)

## Stack

- **Astro 6** (static site) + **React** islands
- **Tailwind CSS 4** + **DaisyUI**
- **Three.js** / `@react-three/fiber` for the 3D model browser
- **KaTeX** for math on pages
- BibTeX parsing via `@retorquere/bibtex-parser`
- Deployed to **GitHub Pages** (`main` → Actions)

Requires **Node.js ≥ 22.12**.

## Pages

| Path | Content |
|------|---------|
| `/` | Home / intro |
| `/research` | Research areas |
| `/papers` | Publications (from BibTeX) |
| `/cv` | CV timeline |
| `/project` | 3D model gallery |
| `/blog` | Blog posts |

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build    # output in dist/
npm run preview  # preview production build
```

## Content you usually edit

| File / folder | Purpose |
|---------------|---------|
| `src/settings.ts` | Name, institute, SEO, social links, themes |
| `src/data/cv.ts` | Experiences, education, publications hooks |
| `src/data/cv_plain.ts` | Plain CV text exported to the LaTeX CV repo |
| `src/data/Mypaper.bib` | Publication list (BibTeX) |
| `src/data/3Dmodels.ts` | Metadata for models in `public/3Dmodels/` |
| `src/content/BlogPosts/*.md` | Blog posts (frontmatter: `title`, `date`, `excerpt`, optional `tags`) |

Site URL used for sitemap / canonical: set in `astro.config.mjs` (`site`) and `src/settings.ts` (`template.website_url`).

## CV sync

`npm run export:cv` writes into `/var/www/CV-Yicheng-Xu`:

- `cv_plain.json`
- `links.tex`
- `Mypaper.bib`

That LaTeX repo builds the PDF via GitHub Actions; `git_push.sh` can pull the PDF back into `public/CV_YichengXu.pdf`.

## Deploy (this machine)

From `/var/www/Portfolio`:

```bash
sudo sh deploy_astro.sh
```

The script:

1. Builds in a user-writable copy under `$HOME/Portfolio-build`
2. Runs `export:cv`
3. Commits and pushes this repo (triggers Pages)
4. Runs `/var/www/CV-Yicheng-Xu/git_push.sh`
5. Removes the temporary build directory

Push uses the root SSH key at `/root/.ssh/id_rsa` when run with `sudo`.

## Credits

Originally based on the [Astro Academia](https://github.com/maiobarbero/astro_academia) template; customized for this site.
