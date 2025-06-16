// app/dashboardTest/[event_id]/page.tsx
import EventDashboardClient from './EventDashboardClient';

export default async function Page({ params }: { params: { event_id: string } }) {
  return <EventDashboardClient event_id={params.event_id} />;
}
