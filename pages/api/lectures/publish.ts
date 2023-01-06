import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  const credentials = request.cookies['wp-credentials']
  const url = `https://test.hva.org.ua/wp-json/hva-automation/v1/courses/${request.body.location.courseId}/lectures`
  const body = {
    post_title: request.body.wpContent.title,
    post_content: request.body.wpContent.content,
    post_status: 'publish',
    post_type: 'sfwd-topic',
    meta_input: {
      course_id: request.body.location.courseId,
      lesson_id: request.body.location.lessonId,
    },
    tax_input: {
      language: 'ua',
    },
    menu_order: request.body.location.menuOrder,
  }
  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    res.status(500).json(await resp.json())
    return
  }
  res.status(200).json({ success: true })
}
