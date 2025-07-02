// src/interfases/callQueue.ts

// 呼び出しキュー内の商品情報 (transaction_detail の中の item)
export interface CallQueueItem {
  name: string;
  price: number;
}

// 呼び出しキュー内の取引詳細情報 (transaction_detail)
export interface CallQueueDetail {
  quantity: number;
  // item は配列として定義する
  item: CallQueueItem[]; 
}

// 呼び出しキュー内の取引情報 (transaction)
export interface CallQueueTransaction {
  id: number;
  user_id: string;
  amount: number;
  store_id: string;
  details: CallQueueDetail[];
}

// 呼び出しキューのメインのデータ構造 (call_queue)
export interface CallQueueData {
  id: number;
  is_called: boolean;
  // transaction は配列として定義する (nullの可能性も残す)
  transaction: CallQueueTransaction[] | null; 
}