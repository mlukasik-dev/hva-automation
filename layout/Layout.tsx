import { CSSProperties, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import { LINKS } from './links'

const drawerWidth = 240

type Props = {
  children?: React.ReactNode
}

export function Layout({ children }: Props) {
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div
      css={{
        display: 'flex',
      }}
    >
      <Head>
        <title>App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppBar
        css={theme => ({
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open
            ? {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: theme.transitions.create(['width', 'margin'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              }
            : {}),
        })}
        position="absolute"
      >
        <Toolbar css={{ paddingRight: 24 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            css={{
              marginRight: 36,
              display: open ? 'none' : 'flex',
            }}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography css={{ flexGrow: 1 }} variant="h6">
            <Link
              css={{
                textDecoration: 'none',
                color: 'inherit',
              }}
              href="/"
              passHref
            >
              HVA automation
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        css={theme => ({
          '.MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            ...(open
              ? {}
              : {
                  overflowX: 'hidden',
                  transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                  }),
                  width: theme.spacing(7),
                }),
          },
        })}
        variant="permanent"
        open={open}
      >
        <div
          css={theme => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 8px',
            ...(theme.mixins.toolbar as CSSProperties),
          })}
        >
          <IconButton onClick={handleDrawerClose} size="large">
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />

        <List>
          {LINKS.map(link => (
            <Link
              css={{ color: 'initial', textDecoration: 'none' }}
              href={link.to}
              key={link.to}
              passHref
            >
              <Tooltip
                title={link.text}
                placement="right"
                disableHoverListener={open}
                disableTouchListener={open}
                disableFocusListener={open}
              >
                <ListItemButton>
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={link.text} />
                </ListItemButton>
              </Tooltip>
            </Link>
          ))}
        </List>
      </Drawer>

      <main
        css={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          paddingTop: 90,
          paddingLeft: 40,
          paddingRight: 40,
          paddingBottom: 40,
        }}
      >
        {children}
      </main>
    </div>
  )
}
