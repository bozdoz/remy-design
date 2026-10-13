# Project maintenance

Work only with files, apps and services relevant to this project. Ask before accessing anything outside that scope, as agreed with the owner.

## Source of truth

- Edit page templates in `scripts/build.mjs`, project content in `content/`, styles in `public/style.scss` and browser behavior in `public/site.js`.
- Rebuild generated HTML; do not hand-edit it. Compiled CSS is ignored and produced by the build.
- Preserve supplied source assets and local `outputs/` deliverables. Avoid deleting historical public assets without checking compatibility.
- Keep the hero visible when JavaScript, fonts or animations fail. Respect reduced motion and accessible menu/video controls.

## Verification and publishing

Run `npm run build` and `npm run check`. Check mobile/desktop layouts for visual changes. Do not submit the contact form as part of automated checks.

Pushes to `main` deploy through GitHub Actions. Confirm successful deployment and verify the relevant live page before reporting that a change is live.

See `README.md` for asset replacement, CV cache versions and the unresolved iPhone sharing-preview issue.
