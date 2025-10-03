import TrackOrderPage from '@/components/TrackOrderPage'
import AppLayout from '@/components/AppLayout'

export default function TrackOrder() {
  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <TrackOrderPage />
    </AppLayout>
  )
}
