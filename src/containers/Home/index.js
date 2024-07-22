import DashboardNotification from '@/components/home/DashboardNotification'
import DashboardStatus from '@/components/home/DashboardStatus'

const HomeContainer = () => {
  return (
    <section className="flex-center flex-col gap-8 text-nowrap text-base font-light text-primary ">
      <DashboardNotification />
      <DashboardStatus />
    </section>
  )
}

export default HomeContainer
