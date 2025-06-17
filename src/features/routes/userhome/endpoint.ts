import { EventData } from "@/interfases/event";
import { supabase } from "@/lib/supabase";

export async function getOwnEvent(userId: string | undefined): Promise<EventData[] | null> {
    const { data, error: fetchError } = await supabase.from('event').select('*').eq('owner_id', userId);

    console.log(userId)
    if (data == null) {
        return null;
    }

    const eventList: EventData[] =
        data.map((record: any) => ({
            id: record.id || "",
            name: record.name || "",
            owner_id: record.owner_id || "",
            description: record.description || "",
            store_list: [],
        })
        )
    return eventList;
}