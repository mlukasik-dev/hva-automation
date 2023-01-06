import type { NextApiRequest, NextApiResponse } from 'next'
import { GoogleAuth } from 'google-auth-library'
import { sheets } from '@googleapis/sheets'

const service = sheets({
  version: 'v4',
  auth: new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  }),
})

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const resp = await service.spreadsheets.values.get({
    spreadsheetId: '1t2LG5c8bupUYZ1DjnabadE1dE92gfa4F2TPg5k-g_3A',
    range: 'Courses',
  })
  res.status(200).json(resp.data)
}
