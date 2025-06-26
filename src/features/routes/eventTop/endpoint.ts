'use server'

import { supabase } from "@/lib/supabase";
import { EventData } from "@/interfases/event";
import { StoreData } from "@/interfases/store";

/* イベントのIDからイベントが存在するかチェックする */
export async function existEvent(eventId: string): Promise<boolean> {
    const { data, error } = await supabase.from('event').select('id').eq('id', eventId).single()
    if (error || !data) {
        return false;
    }
    return true;
}
/* イベントと店舗の情報を返す */
export async function getEventInfo(eventId: string): Promise<EventData | null> {
    // eventに存在するstoreを取得
    const store = await getStore(eventId);

    // eventの情報を取得
    const event = await getEvent(eventId);
    if (event != null) {
        const eventData: EventData = {
            id: event.id || "",
            name: event.name || "",
            owner_id: event.owner_id || "",
            description: event.description || "",
            store_list: store != null ? store.map((record: StoreData) => ({
                id: record.id,
                name: record.name,
                image: record.image || '',
                owner_id: record.owner_id || '',
                description: record.description || '',
                item_list: []
            })) : [],
        };
        return eventData;
    }
    return null;
}

/* eventの情報を取得 */
async function getEvent(eventId: string) {
    const { data, error } = await supabase.from('event').select('*').eq('id', eventId).single();
    return data
}
/* storeの情報を取得 */
async function getStore(eventId: string) {
    const { data, error } = await supabase.from('store').select('*').eq('event_id', eventId);
    return data;
}