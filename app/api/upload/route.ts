import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { env } from '@/lib/config'

export const runtime = 'nodejs'

/**
 * POST /api/upload — proxies image uploads to the Flora CMS API.
 * The backend handles file storage and returns a public URL.
 */
export async function POST(request: Request) {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()

    // Forward the entire multipart request to the backend
    const backendResponse = await fetch(`${env.apiUrl}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(
        data,
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('[admin] upload error:', error)
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 })
  }
}
