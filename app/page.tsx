import { Suspense } from 'react';

export default async function Page() {
  // Server Component: no client JS by default
  const released: string[] = [
    "Monitor performance across a...",
    "Your current CRA sections can render here as server components",
  ];

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">CADENCE</h1>
        <form action="/auth/signout" method="post">
          <button className="rounded-lg border px-3 py-1.5 text-sm">Sign out</button>
        </form>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-medium mb-3">Releases</h2>
          <ul className="list-disc list-inside space-y-1">
            {released.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <h2 className="font-medium mb-3">Team</h2>
          <p className="text-sm text-gray-600">Move your CRA widgets here and split into components.</p>
        </div>
      </section>
    </main>
  );
}
