// app/dashboardTest/[eventid]/page.tsx
import EventDashboardClient from './EventDashboardClient';

export default async function Page({ params }: { params: { eventid: string } }) {
  return <EventDashboardClient eventid={params.eventid} />;
}
