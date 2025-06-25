import { StoreData } from "./store";

export interface EventData {
    id: string;
    name?: string;
    owner_id?: string;
    description?: string;
    store_list?: StoreData[];
}