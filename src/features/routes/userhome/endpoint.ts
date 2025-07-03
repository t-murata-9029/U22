import { EventData } from "@/interfases/event";
import { StoreData } from "@/interfases/store";
import { supabase } from "@/lib/supabase";

/**
 * 渡されたuserIdの所属しているイベントを返す
 * @param userId ユーザーID
 * @returns EventData[]
 */
export async function getJoinedEvents(userId: string | undefined): Promise<EventData[]> {
  const { data } = await supabase
    .from('event_user_reration') // 参加者テーブル
    .select(`
        events (
          id,
          name,
          email,
          owner_id,
          description
        )
      `) // events テーブルの全カラムを結合して取得
    .eq('user_id', userId); // 指定された user_id でフィルタリング

  // 所属してなかった場合
  if (data == null) {
    return [];
  }

  const eventList: EventData[] = data.flatMap((record) =>
    record.events.map((eventItem: EventData) => ({
      id: eventItem.id || "",
      name: eventItem.name || "",
      owner_id: eventItem.owner_id || "",
      description: eventItem.description || "",
      store_list: [],
    }))
  );
  return eventList;
}

/**
 * 渡されたuserIdの所属しているストアを返す
 * @param userId ユーザーID
 * @returns StoreData[]
 */
export async function getJoinedStores(userId: string | undefined): Promise<StoreData[]> {
  const { } = await supabase
    .from('event_user_relation') // 参加者テーブル
    .select(`
        events (
          id,
          name,
          email,
          owner_id,
          description
        )
      `) // events テーブルの全カラムを結合して取得
    .eq('user_id', userId); // 指定された user_id でフィルタリング   
  return []
}