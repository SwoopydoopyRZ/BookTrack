# BookTrack Home

Mobile-friendly household book inventory PWA hosted on GitHub Pages. Book data is shared between invited household members through Supabase Auth and a protected Postgres table.

## Supabase database deployment

The schema migration is stored in `supabase/migrations/`. The Supabase GitHub integration applies migrations when they reach the configured production branch. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for integration and deployment settings.

## Privacy

- Email magic-link sign-in for invited accounts.
- Public sign-ups should remain disabled.
- Row Level Security requires authentication for all book operations.
- Invite only household members you trust; all authenticated users in this Supabase project can access the household's shared books.
- The browser app uses a Supabase publishable key. Never put a secret/service-role key in client code or GitHub.

## Existing local books

On first sign-in, locally stored books are merged into the shared database by book ID. If an ID exists both locally and remotely, the remote record wins. Export a backup before first sync.

## GitHub Pages deployment

GitHub Actions deploys the repository root to GitHub Pages automatically on every push to `main`. You can also start a run manually from the repository's **Actions** tab using **Deploy BookTrack to GitHub Pages**.

One-time repository setup: open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**. Do not select “Deploy from a branch”.

After the first successful deployment, add the published site URL to Supabase Authentication's allowed redirect URLs.

## Features

- Add, search and delete household books. Search the saved collection by title or author; on the Add a book screen, search Open Library and Google Books by title or author and bring a result into the form. BookTrack creates each book ID automatically; only title and room are required.
- Warn before adding a duplicate book; you can still choose to add another copy.
- Switch between light and dark themes in Settings; the choice is saved on the current device.
- Shared online collection with live refresh across signed-in devices.
- Email magic-link sign-in.
- QR code and Code 128 barcode generation and scanning.
- Scan a saved book's ISBN or BookTrack label to see its title, room and shelf. Look up an ISBN through Open Library and Google Books, then review and add the result to your collection.
- JSON export/import backups.
- Installable PWA support.

Camera scanning requires HTTPS, camera permission and the scanner library CDN. ISBN lookup and online title/author searches require an internet connection and use Open Library and Google Books. Catalogs may not list every edition; if neither has a match, search by title or author or enter the details manually. Book details you add are saved with the book and synced with the household collection.
