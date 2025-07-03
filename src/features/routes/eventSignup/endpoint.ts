import { supabase } from "@/lib/supabase";
import { readdir } from "fs";

/* イベント作成する関数 */
export async function signup(formData: FormData) {
    // 値をfoamから取得
    const eventName = formData.get('eventName')?.toString();
    const discription = formData.get('discription')?.toString();
    const userid = formData.get('userid')?.toString();

    // イベントをインサート
    const { data: eventData, error: eventError } = await supabase
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

    if (eventError || eventData == null) {
        console.error("イベント作成処理でエラーが発生しました。");
        return;
    }

    // 参加者としても登録
    const { error: relationError } = await supabase
        .from('event_user_relation') // 挿入するテーブル名
        .insert([
            {
                event_id: eventData[0].id,
                user_id: userid
            },
        ]);

    if (relationError) {
        console.error("イベント作成処理でエラーが発生しました。")
        return;
    }

}