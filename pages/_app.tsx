import { UIProvider } from '@/components/UIProvider'
import { Layout } from '@/layout/Layout'
import { createTheme } from '@mui/material'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { QueryClient, QueryClientProvider } from 'react-query'

const theme = createTheme({})

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider theme={theme}>
        {router.route.startsWith('/login') ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </UIProvider>
    </QueryClientProvider>
  )
}
