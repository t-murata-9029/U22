'use client'
import EventUploadForm from '@/components/EventUploadForm';
import { useParams } from 'next/navigation';

// このページはサーバーコンポーネントです
export default function Page() {

  const params = useParams()
  // URLのパスから eventid を取得
  let event_id = ""
  if (params.event_id === 'string') {
    event_id = params.event_id;
  }


  // 取得した eventid をクライアントコンポーネントにpropsとして渡す
  return (
    <div>
      <EventUploadForm eventid={event_id} />
    </div>
  );
}