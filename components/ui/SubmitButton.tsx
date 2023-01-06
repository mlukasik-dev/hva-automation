import { Publish as PublishIcon } from '@mui/icons-material'
import { LoadingButton, LoadingButtonProps } from '@mui/lab'

export function SubmitButton(props: LoadingButtonProps) {
  return (
    <LoadingButton
      type="submit"
      variant="contained"
      startIcon={<PublishIcon />}
      loadingPosition="start"
      {...props}
    >
      Submit
    </LoadingButton>
  )
}
