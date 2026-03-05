const TENANT_MAP: Record<
  string,
  { packageName: string; fingerprints: string[] }
> = {
  beta: {
    packageName: "com.bananatests.beta",
    fingerprints: ["AA:BB:...:FF"],
  },
  alpha: {
    packageName: "com.bananatests.alpha",
    fingerprints: ["11:22:...:99"],
  },
};

function tenantFromHost(host: string | null) {
  if (!host) return null;
  const hostname = host.split(":")[0];
  const parts = hostname.split(".");
  return parts.length >= 3 ? parts[0] : null;
}

export async function GET(req: Request) {
  const host = req.headers.get("host");
  const tenant = tenantFromHost(host) ?? "default";

  const cfg = TENANT_MAP[tenant];
  if (!cfg) {
    return new Response("unknown tenant", { status: 404 });
  }

  const body = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: cfg.packageName,
        sha256_cert_fingerprints: cfg.fingerprints,
      },
    },
  ];

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
