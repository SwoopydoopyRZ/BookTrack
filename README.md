# BookTrack — VS Code + GitHub project

This is the BookTrack web app with one shared household password.

## Open in VS Code
1. Extract this ZIP.
2. In VS Code choose **File → Open Folder** and select the extracted `BookTrack-VSCode-GitHub` folder.
3. The main app is `index.html`. Login is `login.html`. Server files are in `api/` and `middleware.js`.

## Deploy to Vercel
1. Create a GitHub repository and upload/push the contents of this folder (not the ZIP itself).
2. In Vercel choose **Add New → Project**, import that GitHub repository, and deploy it.
3. In Vercel open **Project → Settings → Environment Variables**.
4. Add `HOUSEHOLD_PASSWORD` with the shared password you choose.
5. Add `SESSION_SECRET` with a separate long random secret. Do not use the household password again as the secret.
6. Set both for **Production** (and Preview if you use preview deployments), save, then redeploy.

The root of the repository must contain `index.html`, `login.html`, `middleware.js`, `package.json`, `api/`, `sw.js`, and `manifest.webmanifest`.

## Test locally
Install Node.js, then in the VS Code terminal run:
```bash
npm install
npx vercel dev
```
Local testing also requires the two environment variables. You can create a local `.env` file with:
```env
HOUSEHOLD_PASSWORD=choose-a-local-test-password
SESSION_SECRET=use-a-different-long-random-secret
```
Do **not** commit `.env` to GitHub. `.gitignore` excludes it.

## Important notes
- This is a single shared household password, not individual accounts.
- The password protects the app pages through Vercel middleware and a signed, HttpOnly session cookie (7 days).
- Book data remains stored in each browser/device's local storage. Password login does **not** synchronize books between devices.
- QR/barcode libraries load from CDNs; scanning requires internet, HTTPS and camera permission.
- The service worker was changed so it does not cache navigation responses or authenticated pages. This avoids serving a stale cached redirect/login response.
- This project is prepared to address the previous redirect-loop issue, but it has not been deployed or tested on your Vercel account. Check the deployed login flow before relying on it.
