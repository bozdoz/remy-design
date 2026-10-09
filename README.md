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

The Figma desktop reference is 2400 pixels wide, with a 1920-pixel content area. Desktop spacing and typography scale fluidly. Content-driven transitions occur at 1100, 900 and 640 pixels. Mobile uses one project column, stacked services and case-study sections, a collapsible navigation menu and full-width form controls.

Breakpoint rationale: [web.dev](https://web.dev/articles/responsive-web-design-basics) and [MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design).

## Contact form

The HTML form posts to FormSubmit and routes enquiries to `jeremyrcormier@gmail.com`. It includes a honeypot, native email/message validation and FormSubmit’s default CAPTCHA. The recipient must complete FormSubmit’s one-time email confirmation before delivery is active. The redirect is `https://remydesign.ca/thanks/`; a direct email link is also provided.

No live submission was sent during verification. After deployment, submit a real test enquiry and confirm receipt. See [FormSubmit setup](https://formsubmit.co/) and [documentation](https://formsubmit.co/documentation).

## Deployment

GitHub Pages remains the production host. Pushes to `main` build, check and deploy `public/`. Pull requests and other branches build/check and upload a downloadable `portfolio-preview` artifact without deploying production. This artifact is a static build, not a hosted preview URL.

Before merging, review the eight draft case studies, verify current app ratings and store destinations, and activate/test email delivery. The CV is available at `/assets/Jeremy_Cormier_2026.pdf`.

## Verification

Local Chrome verification covered the homepage at 320, 390, 640, 768, 900, 1024, 1440, 1920 and 2400 pixels, plus all nine case studies at 390 and 1440 pixels. Checks covered horizontal overflow, image loading, menu behaviour, native form validity, reduced motion and explicit animation play/pause.
