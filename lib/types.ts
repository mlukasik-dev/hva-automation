export type Lecture = {
  id: string
  title: string
  thumbnailSrc: {
    url: string
    width: number
    height: number
  }
  publishedAt: string
}

export type WpContent = {
  title: string
  content: string
}
