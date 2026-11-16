# BookTrack Home

A static, mobile-friendly household book inventory app. It runs on GitHub Pages and does not need a server, Node.js, Vercel, or a password.

## Book data persistence

BookTrack stores the collection in the browser's `localStorage` under its own key. This means:
- Books remain after refreshing the page or closing and reopening the browser.
- The data stays on that browser and device.
- Clearing browser/site data, using private/incognito mode, or removing the browser profile can erase the collection.
- Different devices do not automatically share or synchronize their collections.

Use **Settings → Export backup** regularly. On another device, open BookTrack and use **Settings → Import backup** to bring the collection across. Import merges books by their unique ID.

For automatic multi-device synchronization, a shared online database would need to be added. GitHub Pages alone is static hosting and does not provide a database.

## Deploy with GitHub Pages

1. In this repository, open **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch you want to publish and choose **/(root)** as the folder.
4. Save and wait for GitHub Pages to finish deploying.
5. Open the Pages URL on your phone or computer.

This project is currently being prepared on `feature/github-pages-migration`. Review and test that branch before merging it into `main` or selecting it for publication.

## Run locally

Open `index.html` in a browser for basic testing. For camera scanning and service-worker testing, use a local web server (for example, VS Code's Live Server extension) because browsers restrict camera access and service workers on ordinary file URLs.

## Features

- Add and search household books by title, ID, room, shelf and household member.
- Scan QR codes and Code 128 barcodes.
- Generate printable QR and barcode labels.
- Export and import JSON backups.
- Install as a PWA from a supported browser.

The QR/barcode libraries and camera scanner are loaded from public CDNs, so those features require an internet connection. Camera scanning also requires HTTPS (or localhost) and camera permission.
