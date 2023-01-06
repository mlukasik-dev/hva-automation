import type { NextApiRequest, NextApiResponse } from 'next'
import data from '@/data/data.json'
import youtubeService from '@/lib/youtube'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const resp = await youtubeService.playlistItems.list({
    part: ['snippet'],
    maxResults: 10,
    playlistId: data.youtube.uploadPlaylistId,
  })
  if (resp.status != 200) {
    res.status(resp.status).json({ error: resp.statusText })
    return
  }
  if (!resp.data.items || resp.data.items.length === 0) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  const lectures = resp.data.items.map(item => ({
    id: item.snippet?.resourceId?.videoId,
    title: item.snippet?.title,
    thumbnailSrc: item.snippet?.thumbnails?.default,
    publishedAt: item.snippet?.publishedAt,
  }))
  res.status(200).json({ lectures })
}
