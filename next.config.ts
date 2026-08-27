import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 액션 요청 본문의 기본 상한은 1MB라서 사진 여러 장을 한 번에 올리면
  // 쉽게 넘겨 요청 자체가 거부된다. Vercel 서버리스 함수 자체의 페이로드
  // 상한(4.5MB, 설정으로 못 바꿈)보다는 작게 잡아 여유를 둔다.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
