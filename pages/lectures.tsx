import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material'
import { Publish as PublishIcon } from '@mui/icons-material'
import { useApi } from '@/lib/hooks/useApi'
import { Lecture } from '@/lib/types'
import { useUI } from '@/components/UIProvider/useUI'
import PublishFormDialog from '@/components/PublishFormDialog'
import { useQuery } from 'react-query'

export default function Lectures() {
  return (
    <div>
      <YoutubeVideoList />
    </div>
  )
}

function YoutubeVideoList() {
  const api = useApi()
  const {
    data: lecturesData,
    isLoading,
    isError,
  } = useQuery(['lectures'], () =>
    api.get<{ lectures: Lecture[] }>('/api/lectures')
  )
  const ui = useUI()

  function handlePublish(id: string) {
    ui.showDialog(<PublishFormDialog id={id} />)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error</div>
  }

  return (
    <List>
      {lecturesData?.lectures.map(lecture => (
        <ListItem
          key={lecture.id}
          secondaryAction={
            <IconButton edge="end" onClick={() => handlePublish(lecture.id)}>
              <PublishIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                height: lecture.thumbnailSrc.height / 2,
                width: lecture.thumbnailSrc.width / 2,
                marginRight: 1,
              }}
              src={lecture.thumbnailSrc.url}
              variant="square"
            ></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={lecture.title}
            secondary={new Date(lecture.publishedAt).toLocaleDateString()}
          />
        </ListItem>
      ))}
    </List>
  )
}
