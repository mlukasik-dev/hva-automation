import { useRouter } from 'next/router'
import { Api } from '@/lib/api/browser'
import { useMemo } from 'react'

export function useApi() {
  const router = useRouter()
  const api = useMemo(() => new Api(router), [router])
  return api
}
