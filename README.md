# BookTrack Home

A mobile-friendly household book inventory that can be hosted as a static site on GitHub Pages.

## How book data is saved

BookTrack stores the collection in the browser's `localStorage` on the device where it is used. Saving a book writes the collection to storage immediately, so it remains available after reloading the page or closing and reopening the browser.

**Important limitations:**
- Storage is local to a browser on one device. A phone and a PC each have their own collection.
- Clearing browser/site data, using private/incognito mode, or uninstalling/resetting the browser can remove local data.
- Export a backup regularly in **Settings → Export backup**. On another device, use **Import backup**.
- Automatic sharing between devices requires a shared online database; GitHub Pages alone does not provide one.

The app keeps the existing storage key so collections already saved in this browser under the previous BookTrack version are preserved.

## Run locally

Open `index.html` in a browser for basic use. For camera scanning and service-worker/PWA behavior, use a local HTTP server (for example, VS Code Live Server) or deploy to HTTPS. Camera access requires permission and a secure context.

## Deploy with GitHub Pages

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch `feature/github-pages-migration` and folder `/ (root)`, then save.
4. Wait for GitHub Pages to finish publishing. The Pages URL will be shown in Settings → Pages.

This branch is being prepared separately. Review and test it before merging anything into `main`.

## Features

- Add, search and filter household books by room.
- Save title, unique ID, room, shelf, household member, return instructions and notes.
- Generate QR labels and Code 128 barcodes.
- Scan with a camera or enter a book ID manually (including USB barcode scanners that type like a keyboard).
- Export and import JSON backups.
- Install as a PWA from a supported mobile browser.

QR/barcode libraries and camera scanning need an internet connection. Camera scanning requires HTTPS and camera permission.
