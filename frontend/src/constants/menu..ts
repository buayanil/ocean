import {
    ClockIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    ScaleIcon,
  } from '@heroicons/react/outline'

export const navigation = [
    { name: 'Home', href: '#', icon: HomeIcon, current: true },
    { name: 'Postgres', href: '#', icon: ClockIcon, current: false },
    { name: 'MongoDB', href: '#', icon: ScaleIcon, current: false },
  ]

export const secondaryNavigation = [
    { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
]
