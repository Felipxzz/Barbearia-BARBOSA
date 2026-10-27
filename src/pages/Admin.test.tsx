import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Admin from "./Admin";

const mocks = vi.hoisted(() => ({ invoke: vi.fn(), catalog: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: mocks.invoke } } }));
vi.mock("@/hooks/use-catalog", () => ({ useCatalog: (enabled: boolean) => { mocks.catalog(enabled); return { catalog: { servicos: [], barbeiros: [] } }; } }));
vi.mock("@/components/admin/CatalogManager", () => ({ default: () => null }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
const open = () => render(<QueryClientProvider client={new QueryClient()}><Admin /></QueryClientProvider>);
const submit = () => {
  fireEvent.change(screen.getByLabelText("Senha de administrador"), { target: { value: "example-admin-secret" } });
  fireEvent.click(screen.getByRole("button", { name: "Entrar no painel" }));
};
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe("Protected admin loading", () => {
  it("does not fetch the catalog before server validation", () => {
    open();
    expect(mocks.catalog).toHaveBeenCalledWith(false);
    expect(mocks.invoke).not.toHaveBeenCalled();
  });
  it("never opens the panel when the server rejects the password", async () => {
    mocks.invoke.mockResolvedValueOnce({ data: { error: "Senha incorreta" }, error: null });
    open(); submit();
    await screen.findByRole("alert");
    expect(screen.queryByRole("navigation", { name: "Menu administrativo" })).toBeNull();
    expect(mocks.invoke).toHaveBeenCalledTimes(1);
    expect(mocks.invoke.mock.calls[0][1].body.action).toBe("login-check");
  });
  it("opens only after validation without waiting for the agenda and ignores late reads after logout", async () => {
    let finish: ((value: unknown) => void) | undefined;
    mocks.invoke.mockResolvedValueOnce({ data: { success: true }, error: null });
    mocks.invoke.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    open(); submit();
    await screen.findByRole("navigation", { name: "Menu administrativo" });
    expect(mocks.invoke.mock.calls[1][1].body.action).toBe("list");
    expect(mocks.catalog).toHaveBeenCalledWith(true);
    const logout = screen.getAllByRole("button", { name: "Sair do painel" })[0];
    if (!logout) throw new Error("Logout missing");
    fireEvent.click(logout);
    finish?.({ data: { data: [{ id: "private-row" }] }, error: null });
    await waitFor(() => expect(screen.getByRole("button", { name: "Entrar no painel" })).toBeInTheDocument());
    expect(screen.queryByRole("navigation", { name: "Menu administrativo" })).toBeNull();
  });
});