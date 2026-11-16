# BookTrack Home

Mobile-friendly household book inventory PWA hosted on GitHub Pages. Book data is shared between invited household members through Supabase Auth and a protected Postgres table.

## Supabase database deployment

The schema migration is stored in `supabase/migrations/`. Connect the Supabase project to this GitHub repository using the official integration, with working directory `.`. Supabase can then apply migrations automatically when they reach the configured production branch. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for the one-time authorization and deployment settings.

Do not merge `feature/github-pages-migration` into `main` until the app and migration have been reviewed. If Supabase Branching is enabled on the plan, use a pull-request preview database to test first.

## Privacy

- Email magic-link sign-in for invited accounts.
- Public sign-ups should remain disabled.
- Row Level Security requires authentication for all book operations.
- Invite only household members you trust; all authenticated users in this Supabase project can access the household's shared books.
- The browser app uses a Supabase publishable key. Never put a secret/service-role key in client code or GitHub.

## Existing local books

On first sign-in, locally stored books are merged into the shared database by book ID. If an ID exists both locally and remotely, the remote record wins. Export a backup before first sync.

## GitHub Pages

1. Open repository **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select the branch to publish and choose **/(root)**.
4. Save and wait for deployment.
5. Add the resulting site URL to Supabase Authentication's allowed redirect URLs.

## Features

- Add, search and delete household books with room, shelf, member and return details.
- Shared online collection with live refresh across signed-in devices.
- Email magic-link sign-in.
- QR code and Code 128 barcode generation and scanning.
- JSON export/import backups.
- Installable PWA support.

Camera scanning requires HTTPS, camera permission and the scanner library CDN.
