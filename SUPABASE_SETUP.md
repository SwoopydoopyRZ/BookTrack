# Supabase + GitHub setup for BookTrack

BookTrack's database schema is versioned in `supabase/migrations/`. Once the official Supabase GitHub integration is connected, Supabase applies new migration files automatically. You do not need to paste SQL into the SQL Editor.

## 1. Connect Supabase to GitHub (one-time authorization)

1. Open the [BookTrack Supabase project](https://supabase.com/dashboard/project/pjeeconeytobwztumkan).
2. Open **Project Settings → Integrations**.
3. Find **GitHub Integration** and choose **Authorize GitHub**.
4. On GitHub, authorize the Supabase app and grant it access to the `SwoopydoopyRZ/BookTrack` repository.
5. Return to Supabase, select `SwoopydoopyRZ/BookTrack`, and set **Working directory** to `.` (the `supabase/` folder is at the repository root).
6. Enable the integration and save.

Supabase's GitHub integration watches repository branches and pull requests. It deploys migrations from `supabase/migrations/`. See the [official GitHub integration guide](https://supabase.com/docs/guides/deployment/branching/github-integration).

## 2. Choose when database changes go live

- **Production deployment:** Enable **Deploy to production** and select the repository's production branch (`main`). New migrations are applied to the live Supabase project when changes reach that branch.
- **Preview database for pull requests:** Enable automatic branching if your Supabase plan supports Branching. Supabase creates a separate preview database for a pull request and applies the migration there. This lets us test before merging.
- GitHub integration and production migration deployment are available on all plans; isolated preview branching may require Pro.

The current BookTrack work is on `feature/github-pages-migration`, not `main`. Do not merge it until the app and database migration have been reviewed. If preview branching is not available, the migration will reach the production database only after you approve merging the feature branch into `main`.

## 3. Keep access private

In Supabase **Authentication** settings:

1. Keep email authentication enabled.
2. Disable public sign-ups.
3. Invite household members individually under **Authentication → Users**.
4. Set the correct GitHub Pages site URL under **Authentication → URL Configuration** and add it to the allowed redirect URLs.

The migration enables Row Level Security and grants table access only to authenticated users. Every authenticated account in this project can access the shared household collection, so only invite people you trust.

## 4. Email delivery

Supabase's default email sender has delivery restrictions. For dependable household sign-in, configure a trusted custom SMTP provider in Supabase Auth settings. Keep SMTP credentials and Supabase secret/service-role keys out of GitHub and browser code.

## 5. Verify deployment

After Supabase reports the migration as successful, open **Table Editor** and confirm that `public.books` and `public.room_shelves` exist and RLS is enabled. Then test sign-in, adding a room and shelf, and seeing them on another signed-in device.

The publishable key in `cloud.js` is designed for browser use. Never put a secret/service-role key in this repository.
