import type { NextApiRequest, NextApiResponse } from 'next'

export type PublishLocationResponse = {
  locations: {
    courseId: number
    lessonId: number
    lessonTitle: string
    menuOrder: number
  }[]
}

export default async function handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  if (
    typeof request.query.publishType !== 'string' ||
    !['all', 'specific'].includes(request.query.publishType)
  ) {
    res.status(400).json({ error: 'Bad request' })
    return
  }
  const publishType = request.query.publishType
  if (
    typeof request.query.courseIds !== 'string' ||
    request.query.courseIds === ''
  ) {
    res.status(400).json({ error: 'Bad request' })
    return
  }
  const courseIds = request.query.courseIds.split(',')

  const credentials = request.cookies['wp-content']

  const courses = []
  for (const courseId of courseIds) {
    const url = `https://test.hva.org.ua/wp-json/hva-automation/v1/courses/${courseId}/steps`
    const resp = await fetch(url, {
      headers: { Authorization: `Basic ${credentials}` },
    })
    if (!resp.ok) {
      res.status(500).json(await resp.json())
      return
    }
    const sections = await resp.json()
    courses.push({
      id: +courseId,
      ...sections,
    })
  }

  const locations: PublishLocationResponse['locations'] = courses.map(
    course => {
      let section
      if (publishType === 'all') {
        section = course.sections[course.sections.length - 3]
      } else {
        section = course.sections[course.sections.length - 2]
      }
      const lesson = section.lessons[section.lessons.length - 1]
      const menuOrder = lesson.topics[lesson.topics.length - 1].menu_order + 1
      return {
        courseId: course.id,
        lessonTitle: lesson.title,
        lessonId: lesson.id,
        menuOrder,
      }
    }
  )

  res.status(200).json({ locations })
}
