import OrdersPage from '@/components/OrdersPage'
import AppLayout from '@/components/AppLayout'

export default function Orders() {
  return (
    <AppLayout showHeader={false} showBottomNav={true}>
      <OrdersPage />
    </AppLayout>
  )
}
