'use server'

import { ItemData } from "@/interfases/item";
import { StoreData } from "@/interfases/store";
import { supabase } from "@/lib/supabase";

/* イベントとストアのIDが一緒のものが存在するかチェックする */
export async function existStore(eventId: string, storeId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('store')
        .select('id')
        .eq('event_id', eventId)
        .eq('id', storeId)
        .single()

    if (error || !data) {
        return false;
    }

    return true;
}

/* イベントの情報を取得 */
export async function getStoreInfo(eventId: string, storeId: string): Promise<StoreData> {
    const { data, error: fetchError } = await supabase
        .from('store')
        .select(`
            id,
            name,
            image,
            owner_id,
            description,
            event_id,
            item (
              id,
              store_id,
              name,
              image,
              price,
              description
            )
          `)
        .eq('event_id', eventId)
        .eq('id', storeId)
        .single();
    if (fetchError) {
        throw fetchError;
    }
    const formattedStore: StoreData = { // formattedStores ではなく formattedStore (単数形) に変更
        id: data.id,
        name: data.name,
        image: data.image,
        owner_id: data.owner_id,
        description: data.description,
        item_list: data.item as ItemData[] || [],
    };

    return formattedStore;
}