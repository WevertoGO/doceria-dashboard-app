
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useGlobalSearch() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // returns { type: 'pedido'|'cliente'|'produto', dado }
  async function searchGlobal(query: string) {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const [pedidos, clientes, produtos] = await Promise.all([
        supabase
          .from("pedidos")
          .select("id, valor_total, created_at")
          .ilike("id", `%${query}%`),
        supabase
          .from("clientes")
          .select("id, nome, email, telefone")
          .ilike("nome", `%${query}%`),
        supabase
          .from("produtos")
          .select("id, nome, descricao")
          .ilike("nome", `%${query}%`),
      ]);
      const r: any[] = [];
      // pedidos
      pedidos.data?.forEach((p: any) =>
        r.push({ type: "pedido", ...p })
      );
      // clientes
      clientes.data?.forEach((c: any) =>
        r.push({ type: "cliente", ...c })
      );
      // produtos
      produtos.data?.forEach((p: any) =>
        r.push({ type: "produto", ...p })
      );
      setResults(r);
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, searchGlobal };
}
