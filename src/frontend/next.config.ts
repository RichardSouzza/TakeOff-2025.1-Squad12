import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ["/((?!_next|favicon.ico|images|fonts|api).*)"],
};

export default nextConfig;
