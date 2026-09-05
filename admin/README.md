# Wishes Admin CMS (wishes-admin.csrgo.com)

This directory contains the standalone Netlify CMS (Decap CMS) administration dashboard to create, manage, and publish custom Birthday Wish orders for `wishes.csrgo.com`.

## Features
1. **Manage Birthday Orders**: Update or create new birthday wishes stored in `content/wishes/*.md`.
2. **6 Photos Uploader**: Direct upload for 6 photos stored in `static/images/wishes/`.
3. **Real-Time Slug Availability Checker**:
   - Integrated check directly in the top companion bar.
   - Verifies whether `wishes.csrgo.com/{customisedurl}` already exists as an `.md` file in `content/wishes/`.
4. **Instant 7-Digit PIN Hasher**:
   - Easily hash any 7-digit PIN (e.g. `1234567` &rarr; `h_xdkb3o`) matching the birthday encryption protocol.
5. **Live Preview Panel**:
   - Preview birthday letter, photos, balloons, and slug in real-time within Decap CMS.

---

## Deployment to Netlify (`wishes-admin.csrgo.com`)

### Step 1: Create a new site in Netlify
1. Go to your [Netlify Dashboard](https://app.netlify.com).
2. Click **Add new site** > **Import an existing project**.
3. Select your repository: `srikanth1815101/wishes`.
4. Set the build configurations:
   - **Base directory**: `admin`
   - **Build command**: *(leave blank)*
   - **Publish directory**: `admin` (or `.` if base directory is set to `admin`)
5. Deploy the site.

### Step 2: Set Custom Domain
1. In the new Netlify site settings, go to **Domain management**.
2. Add custom domain: `wishes-admin.csrgo.com`.
3. Add a CNAME record in your DNS provider (e.g., Cloudflare):
   - **Type**: `CNAME`
   - **Name**: `wishes-admin`
   - **Target**: your Netlify site URL (e.g., `<site-name>.netlify.app`).

### Step 3: Enable Netlify Identity & Git Gateway
1. Go to **Site Configuration** > **Identity** in the Netlify site.
2. Click **Enable Identity**.
3. Under **Registration preferences**, set to **Invite only** so only you can access it.
4. Under **Services** > **Git Gateway**, click **Enable Git Gateway**. This allows Decap CMS to commit markdown files directly to `srikanth1815101/wishes` on GitHub.
5. Send yourself an invite from the Identity tab, accept the email invitation, set your password, and log in at `https://wishes-admin.csrgo.com`.

---

## Local Development / Testing
To test the admin UI locally:
```bash
# From workspace root
npx serve admin
# or
python -m http.server 8080 --directory admin
```
Then visit `http://localhost:8080`.
