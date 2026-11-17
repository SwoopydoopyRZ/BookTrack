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

- Add, search and delete household books. Use the bottom search field to find saved books by title or author and see their room and shelf; on the Add a book screen, search Open Library and Google Books by title or author and bring a result into the form. BookTrack creates each book ID automatically; choose a room and a shelf or “No shelf”.
- Warn before adding a duplicate book; you can still choose to add another copy.
- Switch between light and dark themes in Settings; the choice is saved on the current device.
- Manage shared rooms and each room's shelves in Settings; select a room and shelf when adding a book.
- Add a series or collection name to a book; books with the same name are automatically grouped in collapsible sections on the home screen. Series names can be selected from existing books or edited from a saved book's details; catalog results may not include series information.
- Choose a book edition language when adding it, including a custom language. The language is stored with the book and synced across devices.
- Change the app interface language in Settings: English, German, Romanian, or Hungarian. The preference is saved on the current device.
- Make book labels by choosing a book by name and selecting QR code or barcode; barcodes contain the title rather than the generated book ID.
- Track borrowed library books in the Loans tab. Scan an ISBN to fill book details, set a 30-day default return date, see an in-app countdown and mark books returned. Library loans sync separately from owned books.
- Shared online collection with live refresh across signed-in devices.
- Email magic-link sign-in.
- QR code and Code 128 barcode generation and scanning.
- Scan a saved book's ISBN or BookTrack label to see its title, room and shelf. On the Add a book screen, scan a new book's ISBN with your phone camera to look up its details, choose a room and shelf, then save it.
- JSON export/import backups.
- Installable PWA support.

Camera scanning requires HTTPS, camera permission and the scanner library CDN. ISBN lookup and online title/author searches require an internet connection and use Open Library and Google Books. Catalogs may not list every edition; if neither has a match, search by title or author or enter the details manually. Book details you add are saved with the book and synced with the household collection.
