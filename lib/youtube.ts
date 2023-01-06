import { youtube } from '@googleapis/youtube'
import { GoogleAuth } from 'google-auth-library'

const authClient = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/youtube.readonly',
}).fromJSON(
  JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string)
)

const youtubeService = youtube({
  version: 'v3',
  auth: authClient,
})

export default youtubeService
