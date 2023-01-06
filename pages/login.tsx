import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { CredentialsFormDialog } from '@/components/CredentialsFormDialog'
import { useUI } from '@/components/UIProvider/useUI'
import { Credentials } from '@/components/CredentialsFormDialog'

export default function Login() {
  const router = useRouter()
  const { from } = router.query
  const ui = useUI()

  function handleSubmit(creds: Credentials) {
    const cookies = new Cookies()
    const credentials = `${creds.login}:${creds.password}`
    const encoded = window.btoa(credentials)
    cookies.set('wp-credentials', encoded)
    ui.hideDialog()
    router.replace(typeof from === 'string' ? from : '/')
  }

  if (ui) {
    ui.showDialog(<CredentialsFormDialog handleSubmit={handleSubmit} />)
  }
  return <div></div>
}
