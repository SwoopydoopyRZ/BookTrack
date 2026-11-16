# BookTrack Home

A mobile-friendly household book inventory app hosted as a static site on GitHub Pages. Shared book data is stored in Supabase and protected by Supabase Auth and Row Level Security (RLS).

## Shared data and sign-in

- Book records are stored in the Supabase `public.books` table.
- Household members sign in using one-time email links.
- The app requests links only for existing users (`shouldCreateUser: false`).
- Do not enable public sign-ups. Invite only the household members who should have access.
- RLS policies require an authenticated Supabase user for every book read, insert, update and delete.
- The Supabase publishable key is intended for browser use. Never put a Supabase secret/service-role key in this repository or browser code.

## Supabase setup

Follow **SUPABASE_SETUP.md** and run **supabase-setup.sql** in the Supabase SQL Editor before testing the app.

You must also configure the deployed GitHub Pages URL under Supabase Authentication URL Configuration, disable public sign-ups, and invite household members under Authentication → Users. The default Supabase email sender has limited delivery; configure custom SMTP before relying on sign-in emails for the household.

## Existing local books

On the first successful sign-in, BookTrack merges locally stored books into the shared database by book ID. If the same ID exists both locally and remotely, the remote version wins. Export a backup before first sync as an extra precaution.

## Deploy with GitHub Pages

1. Open repository **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select the branch to publish and choose **/(root)**.
4. Save and wait for deployment.
5. Add the resulting site URL to Supabase's allowed redirect URLs.

This work is being prepared on `feature/github-pages-migration`. Review and test it before merging into `main`; the main branch has not been changed by this work.

## Features

- Add, search and delete household books, with room, shelf, member and return details.
- Shared online book collection with live refresh across signed-in devices.
- Email magic-link sign-in.
- QR code and Code 128 barcode generation and scanning.
- JSON export/import backups.
- Installable PWA support.

Camera scanning requires HTTPS, camera permission and the scanner library CDN.
