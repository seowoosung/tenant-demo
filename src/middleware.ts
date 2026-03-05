import { NextRequest, NextResponse } from "next/server";

function getTenantFromHost(host: string) {
  const hostname = host.split(":")[0];

  if (hostname === "localhost") return null;

  const parts = hostname.split(".");

  // *.lvh.me 로컬 테스트
  if (hostname.endsWith("lvh.me")) {
    return parts.length >= 3 ? parts[0] : null;
  }

  // 일반 도메인
  return parts.length >= 3 ? parts[0] : null;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};

export default function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const tenant = getTenantFromHost(host);

  if (!tenant) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/tenant/${tenant}${url.pathname}`;

  return NextResponse.rewrite(url);
}
