import { EventData } from "@/interfases/event";
import { supabase } from "@/lib/supabase";

/** Eventを全件取得する
 * 　Eventの件数増えたら重くなるから数件ずつ取得とかに仕様変えた方がいい
 */
export async function getAllEvent(): Promise<EventData[] | null> {
    const { data, error } = await supabase.from('event').select('*');

    if (data == null) {
        return null
    }

    return data;
}