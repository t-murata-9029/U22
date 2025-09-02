import { supabase } from "@/lib/supabase";

/* イベント作成する関数 */
export async function signup(formData: FormData) {
    // 値をfoamから取得
    const eventName = formData.get('eventName')?.toString();
    const discription = formData.get('discription')?.toString();
    const userid = formData.get('userid')?.toString();

    // イベントをインサート
    const { data: eventInfo, error } = await supabase
        .from('event') // 挿入するテーブル名
        .insert([
            {
                name: eventName,
                description: discription,
                owner_id: userid,
                email: "",
            },
        ])
        .select();

    if (!eventInfo || eventInfo.length === 0) {
        return;
    }

    const { } = await supabase.from('event_user_relation').insert([
        {
            event_id: eventInfo[0].id,
            user_id: userid
        }
    ])
    if (error) {
        throw error;
    }

}