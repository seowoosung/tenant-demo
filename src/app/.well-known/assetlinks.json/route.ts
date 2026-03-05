function tenantFromHost(host: string | null) {
  if (!host) return null;

  const hostname = host.split(":")[0]; // alpha.bananatests.com
  const parts = hostname.split(".");

  return parts.length >= 3 ? parts[0] : null;
}

export async function GET(req: Request) {
  const host = req.headers.get("host");
  const tenant = tenantFromHost(host);

  if (!tenant) {
    return new Response("unknown tenant", { status: 404 });
  }

  const s3Url = `https://firehose-testsb.s3.ap-northeast-2.amazonaws.com/${tenant}/assetlinks.json`;

  try {
    const res = await fetch(s3Url, {
      // S3 파일이 자주 안 바뀌면 캐싱 추천
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new Response("assetlinks not found", { status: 404 });
    }

    const body = await res.text();

    return new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json",
        // Android verification 안정성
        "cache-control": "public, max-age=300",
      },
    });
  } catch (e) {
    return new Response("upstream error", { status: 500 });
  }
}
