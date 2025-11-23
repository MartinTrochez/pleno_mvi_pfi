import React from 'react'

import { HomeView } from '@/modules/home/ui/views/home-view'
import { requireAuth } from '@/lib/auth-utils'

export default async function HomePage() {
  await requireAuth()

  return (
    <HomeView />
  )
}
