import {
  Home as HomeIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
} from '@mui/icons-material'

export const LINKS = [
  {
    text: 'Головна',
    to: '/',
    icon: <HomeIcon />,
  },
  {
    text: 'Лекції',
    to: '/lectures',
    icon: <SchoolIcon />,
  },
  {
    text: 'Тести',
    to: '/quizes',
    icon: <QuizIcon />,
  },
]
