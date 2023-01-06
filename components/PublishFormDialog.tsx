import { useEffect, useMemo, useState } from 'react'
import {
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
} from '@mui/material'
import { useApi } from '@/lib/hooks/useApi'
import { WpContent } from '@/lib/types'
import data from '@/data/data.json'
import { InCaseOfProblems } from '@/components/InCaseOfProblems'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { useUI } from './UIProvider/useUI'
import { PublishLocationResponse } from '@/pages/api/lectures/publish-location'
import { DoneOutline, Publish } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'

type Props = {
  id: string
}

type Inputs = {
  publishType: 'all' | 'specific'
  editWpContent: boolean
  wpContent: WpContent
  courseId: string
}

export default function PublishFormDialog({ id }: Props) {
  const [isPublishing, setIsPublishing] = useState(false)
  const { register, control, handleSubmit, setValue, watch } = useForm<Inputs>({
    defaultValues: {
      editWpContent: false,
      publishType: 'all',
    },
  })
  const [publishTypeValue, wpContent, editWpContent, courseIdValue] = watch([
    'publishType',
    'wpContent',
    'editWpContent',
    'courseId',
  ])
  const courses = useMemo(() => {
    return data.ldCourses.filter(course => {
      if (publishTypeValue === 'all') {
        return true
      }
      return course.id === +courseIdValue
    })
  }, [publishTypeValue, courseIdValue])
  const courseIds = useMemo(() => {
    return courses.map(course => course.id).join(',')
  }, [courses])

  const api = useApi()

  const { isLoading: isWpContentLoading, isError: isWpContentError } = useQuery(
    ['wpContent', id],
    () => api.get<WpContent>(`/api/lectures/${id}/wp-content`),
    { onSuccess: data => setValue('wpContent', data) }
  )
  const [publishLocations, setPublishLocations] = useState<
    (PublishLocationResponse['locations'][0] & { published: boolean })[]
  >([])
  const {
    data: publishLocationsData,
    isLoading: isPublishLocationsLoading,
    isFetching: isPublishLocationsFetching,
    isError: isPublishLocationsError,
  } = useQuery(
    ['publish-locations', courseIds, publishTypeValue],
    () =>
      api.get<PublishLocationResponse>(
        `/api/lectures/publish-location?courseIds=${courseIds}&publishType=${publishTypeValue}`
      ),
    {
      enabled: courseIds !== '',
      onSuccess: data =>
        setPublishLocations(
          data.locations.map(location => ({ ...location, published: false }))
        ),
    }
  )

  useEffect(() => {
    if (
      publishTypeValue === 'specific' &&
      data.ldCourses.length &&
      !courseIdValue
    ) {
      setValue('courseId', data.ldCourses[0].id.toString())
    }
  }, [publishTypeValue, courseIdValue, courses, setValue])

  const ui = useUI()

  async function onSubmit({ wpContent }: Inputs) {
    if (!publishLocationsData) {
      ui.showError({ message: 'Error happened' })
      return
    }
    setIsPublishing(true)
    for (const location of publishLocationsData.locations) {
      const data = {
        wpContent,
        location,
      }
      api
        .post(`/api/lectures/publish`, data)
        .then(() => {
          setPublishLocations(
            publishLocations.map(item => ({ ...item, published: true }))
          )
          setIsPublishing(false)
          ui.showSnackbar({
            message: 'Лекція успішно опублікована',
            autoHideDuration: 3000,
          })
        })
        .catch(() => {
          setIsPublishing(false)
          ui.showError({ message: 'Error happened' })
        })
    }
  }

  if (
    isWpContentLoading ||
    isPublishLocationsLoading ||
    isPublishLocationsFetching
  ) {
    return <CircularProgress size={60} />
  }

  if (isWpContentError || isPublishLocationsError) {
    ui.showError({ message: 'Error happened' })
  }

  return (
    <form css={{ width: 1000 }} onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>Опублікувати лекцію</DialogTitle>
      <DialogContent>
        <DialogContentText css={{ marginBottom: 15 }}>
          <InCaseOfProblems />
        </DialogContentText>

        <FormGroup>
          <Controller
            name="editWpContent"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                control={<Switch />}
                label="Редагувати"
              />
            )}
          />
        </FormGroup>
        {editWpContent ? (
          <>
            <TextField
              {...register('wpContent.title')}
              inputProps={{ style: { fontSize: 14, lineHeight: 1.2 } }}
              fullWidth
            />
            <Controller
              name="wpContent.content"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  css={{ marginTop: 5 }}
                  inputProps={{ style: { fontSize: 14, lineHeight: 1.2 } }}
                  multiline
                  fullWidth
                ></TextField>
              )}
            />
          </>
        ) : (
          <div
            css={{ fontSize: 14, lineHeight: 1.2, padding: 50, paddingTop: 0 }}
          >
            <h2 dangerouslySetInnerHTML={{ __html: wpContent?.title }}></h2>
            <p dangerouslySetInnerHTML={{ __html: wpContent?.content }}></p>
          </div>
        )}

        <div
          css={{
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          <FormControl css={{ marginTop: 15, width: '40%' }}>
            <InputLabel id="publish-type-select-label">
              Де опублікувати
            </InputLabel>
            <Controller
              name="publishType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="publish-type-select-label"
                  id="publish-type-select"
                  label="Де опублікувати"
                  fullWidth
                >
                  <MenuItem value="all">В усіх курсах</MenuItem>
                  <MenuItem value="specific">Обрати курс</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {publishTypeValue === 'specific' && courseIdValue && (
            <FormControl>
              <FormLabel id="course-select-label">Оберіть курс</FormLabel>
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {data.ldCourses.map(course => (
                      <FormControlLabel
                        key={course.id}
                        value={course.id}
                        control={<Radio />}
                        label={course.title}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          )}
        </div>

        <List
          subheader={
            <ListSubheader component="div">Лекція опублікується</ListSubheader>
          }
        >
          {publishLocations.map(location => {
            const text =
              data.ldCourses.find(course => course.id === location.courseId)
                ?.title +
              ' > ' +
              location.lessonTitle +
              ' > остання тема'
            return (
              <ListItem
                key={location.courseId + location.lessonId}
                disablePadding
              >
                <ListItemButton>
                  <ListItemIcon css={{ minWidth: 30 }}>
                    {location.published ? (
                      <DoneOutline />
                    ) : (
                      <CircularProgress size={15} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          startIcon={<Publish />}
          loadingPosition="start"
          loading={isPublishing}
        >
          Опублікувати
        </LoadingButton>
      </DialogActions>
    </form>
  )
}
