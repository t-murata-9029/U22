import { ItemData } from "./item";

export interface StoreData {
    id: string;
    name?: string;
    image?: string;
    owner_id?: string;
    description?: string;
    item_list?: ItemData[]
}