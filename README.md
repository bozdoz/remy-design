# Remy Digital

Jeremy Cormier’s portfolio: a responsive homepage and nine independent case-study pages, based on the final `desktop-home` frame in Figma.

## Local development

Use Node.js 24 and npm.

```sh
npm ci
npm start
```

Open `http://127.0.0.1:4173`. The server rebuilds when the page generator, project content or Sass changes; refresh the browser to see updates. Set `PORT` to choose another port.

```sh
npm run build
npm run check
```

The build generates the homepage, project pages, sitemap, utility pages and compiled CSS. Checks verify internal links and asset paths, required project images, form markup and the Pando/Collab SVG references.

## Editing

- `content/projects.json`: titles, descriptions, draft status and seven placed assets per project. Pando’s supplied case-study copy is retained; the other eight have draft copy prepared for review.
- `scripts/build.mjs`: shared navigation, page templates, contact form and static HTML generation.
- `public/style.scss`: responsive styles and design tokens.
- `public/site.js`: mobile navigation and animation controls.
- `public/assets/`: supplied logos, CV, fonts and project assets. Still images have WebP variants; animated GIFs are served as MP4 with still posters. Original files are retained locally outside the published directory.
- `content/image-dimensions.json`: responsive-image width descriptors. Update when replacing WebP files.

Project URLs are `/projects/<slug>/`. The previous site had no project pages. The homepage and existing Behance/LinkedIn destinations are retained; previous public image files remain available.

## Responsive behaviour

The Figma desktop reference is 2400 pixels wide, with a 1920-pixel content area. Desktop spacing and typography scale fluidly up to a 1600-pixel viewport cap, with a maximum 1280-pixel content container. Content-driven transitions occur at 1100, 900 and 640 pixels. Mobile uses one project column, stacked services and case-study sections, a collapsible navigation menu and full-width form controls.

Breakpoint rationale: [web.dev](https://web.dev/articles/responsive-web-design-basics) and [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design).

## Contact form

The HTML form posts to FormSubmit and routes enquiries to `jeremyrcormier@gmail.com`. It includes a honeypot, native email/message validation and explicitly enabled FormSubmit CAPTCHA. All countries are allowed. The form uses the recipient identifier supplied by FormSubmit rather than exposing the Gmail address in its action URL. The recipient confirmed activation on October 9, 2026. The redirect is `https://remydesign.ca/thanks/`; a direct email link is also provided.

No live submission was sent during verification. After deployment, submit a real test enquiry and confirm receipt. See [FormSubmit setup](https://formsubmit.co/) and [documentation](https://formsubmit.co/documentation).

## Deployment

GitHub Pages remains the production host. Pushes to `main` build, check and deploy `public/`. Pull requests and other branches build/check and upload a downloadable `portfolio-preview` artifact without deploying production. This artifact is a static build, not a hosted preview URL.

Before publishing copy changes, review the eight draft case studies and verify current app ratings and store destinations. The CV is available at `/assets/Jeremy_Cormier_2026.pdf`. Its download URL gets an automatic content hash after replacement to avoid serving an old cached PDF.

## Verification

Local Chrome verification covered the homepage at 320, 390, 640, 768, 900, 1024, 1440, 1920 and 2400 pixels, plus all nine case studies at 390 and 1440 pixels. Checks covered horizontal overflow, image loading, menu behaviour, native form validity, reduced motion and explicit animation play/pause.

## Maintenance notes

- Replace the CV at `public/assets/Jeremy_Cormier_2026.pdf`, then rebuild.
- Keep WebP dimensions in `content/image-dimensions.json` consistent with each full-size and 640-pixel image. The generator creates responsive `srcset` references.
- Homepage project tiles use clean background artwork with live text from `content/projects.json`. Compact homepage pill labels are defined by `tileTag` in the generator; all three pills stay in one row.
- Replace an animation using a new MP4 filename plus its matching WebP poster, update `content/projects.json`, and rebuild. This avoids stale browser/CDN media caches.
- Pando placement 2 has a two-second final-frame hold; placement 7 loops in six seconds. Edited GIF deliverables are in the ignored `outputs/` directory.
- Large original artwork remains available for compatibility and future edits. The current pages use optimized WebP backgrounds and lazy-loaded MP4 animations.
- `public/index.html`, project HTML, sitemap and utility pages are generated. Edit the generator/content files rather than changing generated HTML directly. `public/style.css` is generated and ignored by Git.

## Sharing previews

All pages include Open Graph and Twitter metadata in their static HTML. The current shared image is `/remy-share.png` (600 × 315); the supplied larger and square variants remain in `public/assets/social/`. PNG touch icons provide a fallback.

Apple's native macOS LinkPresentation framework retrieved the correct preview image during verification. An iPhone Safari/Messages blank-preview issue remains unresolved; do not treat a successful HTTP fetch or macOS preview as proof of iPhone rendering.

## Code organization and checks

The site has no browser framework or runtime package dependencies. Browser behavior lives in `public/site.js`; reusable page sections live in `scripts/build.mjs`. Preserve the visible-by-default hero fallback, reduced-motion support, keyboard menu controls and server-side CAPTCHA when refactoring.

Run `npm run build` followed by `npm run check` before pushing. For layout or interaction changes, also check mobile and desktop widths, keyboard navigation and reduced motion. Verification should not submit the contact form automatically.
