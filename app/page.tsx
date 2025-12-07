import { redirect } from "next/navigation";

export default function Home() {
  // Redireciona imediatamente para a rota administrativa
  redirect("/admin");
}