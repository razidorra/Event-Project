import { SignIn } from "@clerk/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  // Declares the optional "redirect" search param, e.g. /login?redirect=/
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();

  return (
    <main className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <SignIn routing="hash" forceRedirectUrl={redirect || "/"} />
    </main>
  );
}
