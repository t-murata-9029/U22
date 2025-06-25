export interface ItemData {
  id: string; // uuid
  store_id?: string; // uuid
  name?: string; // text
  image?: string | null; // text (NULL許容)
  price?: number; // int4
  description?: string; // text
}