import { NextRequest, NextResponse } from 'next/server'

// Limit the middleware to paths starting with `/api/`
export const config = {
  matcher: '/api/:function*',
}

export async function middleware(request: NextRequest) {
  // Call our authentication function to check the request
  if (await isAuthenticated(request)) {
    return NextResponse.next()
  }

  request.nextUrl.searchParams.set('from', '/')
  request.nextUrl.pathname = '/login'
  return NextResponse.redirect(request.nextUrl)
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const url = `https://test.hva.org.ua/wp-json/wp/v2/users/me`
  const credentials = request.cookies.get('wp-credentials')
  if (!credentials) {
    return false
  }
  const resp = await fetch(url, {
    headers: { Authorization: `Basic ${credentials.value}` },
  })
  return resp.ok
}
