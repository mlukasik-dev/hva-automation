import type { NextApiRequest, NextApiResponse } from 'next'
import linkifyHtml from 'linkify-html'
import youtubeService from '@/lib/youtube'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const videoId = req.query.id as string
  const resp = await youtubeService.videos.list({
    part: ['snippet'],
    id: [videoId],
  })
  if (resp.status != 200) {
    res.status(resp.status).json({ error: resp.statusText })
    return
  }
  if (resp.data.items?.length !== 1) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  const title = resp.data.items[0].snippet?.title
  const content = [
    resp.data.items[0].snippet?.title,
    wpVideo(videoId),
    linkifyHtml(resp.data.items[0].snippet?.description || ''),
  ].join('\n\n')
  res.status(200).json({ title, content })
}

function wpVideo(id: string): string {
  return `<p style="text-align: center;"><iframe src="//www.youtube.com/embed/${id}" width="560" height="314" allowfullscreen="allowfullscreen"></iframe></p>`
}
