import { Api } from '@/lib/api/server'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const courseId = req.query.id

  const api = new Api(req.cookies['wp-credentials'] as string)
  const url = `https://test.hva.org.ua/wp-json/hva-automation/v1/courses/${courseId}/steps`
  const steps = await api.get(url)
  res.status(200).json(steps)
}
