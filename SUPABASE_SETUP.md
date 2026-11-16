# Supabase setup for BookTrack

Complete these steps in your Supabase project before using the shared BookTrack branch.

## 1. Create the database table and security policies

1. Open the Supabase project dashboard.
2. Select **SQL Editor** → **New query**.
3. Open `supabase-setup.sql` in this repository branch and copy its complete contents.
4. Paste the SQL into the editor and run it.
5. In **Table Editor**, confirm that a `public.books` table exists and that RLS is enabled.

The policies allow authenticated users to access the shared collection. They do not allow anonymous visitors to read or change books.

## 2. Keep registration closed

1. Open **Authentication** → **Sign In / Providers** (the exact menu wording may vary).
2. Open the **Email** provider settings.
3. Turn off **Allow new users to sign up** / public sign-ups.
4. Keep email authentication enabled.

BookTrack requests magic links with account creation disabled. Only users you have invited should be able to sign in.

## 3. Set the allowed redirect URL

Open **Authentication** → **URL Configuration**.

For the GitHub Pages project site, set the Site URL to:

`https://swoopydoopyrz.github.io/BookTrack/`

Add this same address to the allowed Redirect URLs list. If you later use a custom domain or a different Pages URL, update both settings to match it exactly.

## 4. Invite household members

1. Open **Authentication** → **Users**.
2. Choose **Add user** → **Send invitation**.
3. Enter the household member's email address and send the invitation.
4. They should accept the invitation email first.
5. After that, they can open BookTrack and request a one-time sign-in link using that same email address.

Do not turn public sign-ups back on just to add a family member. Invite each person from the dashboard.

## 5. Email delivery

Supabase's built-in email sender is intended mainly for testing and has delivery restrictions. Before relying on household sign-in, configure a trusted custom SMTP provider under the Supabase Authentication email settings. Do not put SMTP credentials in this GitHub repository or in the browser app.

## 6. Test privately before sharing

1. Publish or preview the feature branch using GitHub Pages.
2. Sign in with an invited email address.
3. Add a test book and wait for the sync status to say it is synchronized.
4. Open BookTrack on another device and sign in with another invited email address.
5. Confirm the test book appears, then test adding and deleting a test record.
6. Try opening the app in a signed-out/private browser window; it should show the sign-in screen and the database should deny anonymous access.

## Security notes

- The key in `cloud.js` is a Supabase publishable key. It is designed to be included in browser code.
- Never put a Supabase secret key or legacy service-role key in GitHub, HTML, JavaScript, or a public website.
- Keep public sign-ups disabled. The current RLS policy treats every authenticated account in this Supabase project as a household member, so only invite people you trust.
- Keep using **Settings → Export backup** as an occasional backup. The online database is the shared source of truth, but backups are still useful.
