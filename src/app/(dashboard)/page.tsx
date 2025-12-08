import React from 'react'

import { HomeView } from '@/modules/home/ui/views/home-view'
import { requireAuth } from '@/lib/auth-utils'
import { getQueryClient, trpc } from '@/trpc/server'

export default async function HomePage() {
  await requireAuth()

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.usuarios.getMany.queryOptions({}),
  );

  return (
    <HomeView />
  )
}
