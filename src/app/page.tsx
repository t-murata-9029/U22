import { redirect } from "next/navigation";

// ドメイン直接たたかれたら/homeに遷移する
export default function Home() {
  redirect("/home");
}
