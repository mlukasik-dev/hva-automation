export class Api {
  private authorization: string

  constructor(credentials: string) {
    this.authorization = `Basic ${credentials}`
  }

  async get<T>(url: string): Promise<T> {
    const resp = await fetch(url, {
      headers: {
        Authorization: this.authorization,
      },
    })
    return resp.json()
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authorization,
      },
      body: JSON.stringify(data),
    })
    return resp.json()
  }
}
