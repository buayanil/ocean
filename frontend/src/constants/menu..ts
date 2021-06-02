import {
    ClockIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
  } from '@heroicons/react/outline'

export const navigation = [
    { name: 'Overview', href: '#', icon: HomeIcon, current: true },
    { name: 'Databases', href: '#', icon: ClockIcon, current: false },
  ]

export const secondaryNavigation = [
    { name: 'Settings', href: '#', icon: QuestionMarkCircleIcon },
]
