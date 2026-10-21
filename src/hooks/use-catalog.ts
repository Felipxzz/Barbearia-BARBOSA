import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SERVICOS, BARBEIROS, type Servico, type Barbeiro } from "@/data/barbearia";

export interface CatalogService extends Servico { ativo?: boolean }
export interface CatalogBarber extends Barbeiro { ativo?: boolean }
export interface Catalog { servicos: CatalogService[]; barbeiros: CatalogBarber[] }
export const initialCatalog: Catalog = { servicos: SERVICOS, barbeiros: BARBEIROS };
export const useCatalog = () => {
  const query = useQuery({
    queryKey: ["barbosa-catalog"],
    queryFn: async (): Promise<Catalog> => {
      const { data, error } = await supabase.functions.invoke("admin-agendamentos", { body: { action: "catalog-public" } });
      if (error || data?.error) throw new Error("Não foi possível carregar os serviços e profissionais.");
      return data?.data ?? initialCatalog;
    },
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });
  return { ...query, catalog: query.data ?? initialCatalog };
};