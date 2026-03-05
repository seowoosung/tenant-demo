export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  return (
    <main style={{ padding: 40 }}>
      <h1>Hello {tenant}</h1>
      <p>
        현재 subdomain tenant: <b>{tenant}</b>
      </p>
    </main>
  );
}
