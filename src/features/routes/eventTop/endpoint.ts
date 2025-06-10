import { supabase } from "@/lib/supabase";

/* イベントのIDからイベントが存在するかチェックする */
export async function existEvent(eventId: string): Promise<boolean> {
    const { data, error } = await supabase.from('event').select('id').eq('id', eventId).single()
    if (error || !data) {
        return false;
    }
    return true;
}