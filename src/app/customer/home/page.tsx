export default function CustomerHomePage() {
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">カスタマーホームページ</h1>
      <p className="mb-4">ようこそ！こちらはお客様向けのホームページです。</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>イベント一覧を見る</li>
        <li>ストア情報を確認する</li>
        <li>QRコードを利用する</li>
      </ul>
    </main>
  );
}