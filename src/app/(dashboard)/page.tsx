import { HomeView } from '@/modules/home/ui/views/home-view'
import { requireAuth } from '@/lib/auth-utils'
import { getQueryClient, trpc } from '@/trpc/server'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'

export default async function HomePage() {
  await requireAuth()

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(trpc.home.getDashboardData.queryOptions()),
    queryClient.prefetchQuery(trpc.home.getManySales.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  )
}
