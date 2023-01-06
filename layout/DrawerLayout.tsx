import { Divider, IconButton, Typography, useMediaQuery } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { useUI } from '@/components/UIProvider/useUI'

type Props = {
  title: string
  width?: number
  children?: React.ReactNode
}

export function DrawerLayout({ title, width = 610, children }: Props) {
  const isTablet = useMediaQuery(`(max-width: ${width + 90}px)`)
  const ui = useUI()

  return (
    <div
      css={{
        width: isTablet ? '100vw' : width,
      }}
    >
      <div
        css={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: 28,
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {isTablet && (
          <IconButton css={{ padding: 0 }} onClick={ui.hideDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </div>
      <Divider />
      <div
        css={{
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}
