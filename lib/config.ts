/** Server-only runtime configuration (no NEXT_PUBLIC_ — never exposed to the browser). */

export const env = {
  /** Base URL of the Flora CMS .NET API. */
  apiUrl: process.env.FLORA_API_URL ?? 'http://localhost:5253',

  /** Public site base URL + revalidate secret, used to push instant cache busts. */
  publicSiteUrl: process.env.FLORA_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  revalidateSecret: process.env.FLORA_REVALIDATE_SECRET ?? '',
}

/** Name of the httpOnly cookie that stores the JWT. */
export const SESSION_COOKIE = 'flora_admin_session'
