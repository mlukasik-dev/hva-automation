import { NextRouter } from 'next/router'

export class Api {
  private router: NextRouter

  constructor(router: NextRouter) {
    this.router = router
  }

  async get<T>(url: string): Promise<T> {
    const resp = await fetch(url)
    if (resp.redirected) {
      this.router.replace(resp.headers.get('location') || '/login')
    }
    return resp.json()
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (resp.redirected) {
      this.router.replace(resp.headers.get('location') || '/login')
    }
    return resp.json()
  }
}
