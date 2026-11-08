# Flora CMS — Admin Portal

> Personal portfolio project. Not affiliated with or endorsed by Flora Group; the brand name and imagery are used only to make the demo realistic.

![Overview](docs/screenshots/overview.png)
![Theme editor with live preview](docs/screenshots/theme.png)

A standalone Next.js 16 app for managing the public Flora Group website's theme,
branding, and homepage layout. Part of a 3-part ecosystem: [flora-backend](https://github.com/Jawabreh2k/flora-backend) (.NET 9 API), [flora-group-website](https://github.com/Jawabreh2k/flora-group-website) (public site) and this portal.

## Architecture — Backend-for-Frontend (BFF)

The browser **never** holds the JWT or talks to the .NET API directly. Instead:

```
Browser ──> Admin Portal route handlers ──(Bearer JWT)──> .NET CMS API
              │  (JWT in httpOnly cookie)
              └──(x-revalidate-secret)──> Public site /api/revalidate
```

- **`POST /api/session`** — exchanges credentials for a JWT (via the API's
  `/api/auth/login`) and stores it in an **httpOnly, SameSite=Lax** cookie. Mitigates
  XSS token theft.
- **`DELETE /api/session`** — logout (clears the cookie).
- **`PUT /api/config`** — forwards the edited payload to the API's protected
  `PUT /api/admin/ui/config` with the cookie's Bearer token, then calls the public
  site's revalidation webhook so changes go live **instantly**.
- **`middleware.ts`** — gates `/dashboard` on cookie presence (real authorization is
  enforced by the API's JWT validation).

## Features

- 📊 Overview dashboard with real business stats
- 💼 Jobs: create/edit, with Arabic fields
- 🏢 Companies and subsidiaries: create, edit, hide from the public site
- 📥 Contact inquiries and newsletter subscribers (CSV export)
- 🌗 Dark-mode controls
- 🔐 JWT login (httpOnly cookie session)
- 🎨 Grouped colour-token editor (swatch + free-text, supports hex/oklch/rgb)
- 🔤 Radius + font controls
- 🧩 Homepage section toggles (stats / subsidiaries / spotlight)
- 🖼️ Live preview using the **same CSS-variable mapping** as the public site
- 💾 Save & publish → writes to SQL Server JSON column + instant site revalidation

## Run locally

**Prerequisites:** Node.js 20+, [pnpm](https://pnpm.io) (`npm i -g pnpm`), the [.NET API](https://github.com/Jawabreh2k/flora-backend) on `http://localhost:5253`, and ideally the [public site](https://github.com/Jawabreh2k/flora-group-website) on port 3000.

```bash
cp .env.example .env.local     # copy .env.example .env.local on Windows
pnpm install
pnpm dev                       # http://localhost:3001
```

Set `FLORA_REVALIDATE_SECRET` in `.env.local` to **the same value used by the public site** so that saving a change updates the site instantly.

Sign in with username `admin` and the bootstrap password you set in the API's `appsettings.Local.json`.

## Ports

| App | Port |
| --- | --- |
| Public site | 3000 |
| Admin Portal | 3001 |
| .NET CMS API | 5253 |
