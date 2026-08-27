// 구글맵 URL에 좌표(@lat,lng)나 장소명이 이미 담겨 있으면, API 키 없이 쓸 수
// 있는 비공식 output=embed 트릭으로 미니맵 iframe 주소를 만든다. 이 트릭은
// 구글이 언제든 막을 수 있는 비공식 방식이라 실패하면 조용히 null을 돌려주고,
// 화면에서는 기존 "지도에서 보기" 링크만 남긴다.
//
// maps.app.goo.gl 같은 단축 링크는 실제 좌표가 URL 자체에 없어(서버 리다이렉트
// 이후에만 알 수 있음) 이 함수로는 만들 수 없다.
export function buildMapEmbedSrc(mapUrl: string): string | null {
  let url: URL;
  try {
    url = new URL(mapUrl);
  } catch {
    return null;
  }

  // https://www.google.com/maps/place/.../@37.5665,126.9780,15z/...
  const atMatch = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    const [, lat, lng] = atMatch;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  // https://www.google.com/maps?q=37.5665,126.9780 또는 ?q=장소명
  const q = url.searchParams.get("q");
  if (q) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
  }

  // https://www.google.com/maps/place/장소이름/...
  const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) {
    const place = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`;
  }

  return null;
}

// maps.app.goo.gl 같은 "링크 복사" 단축 링크는 실제 좌표가 URL 자체에 없고,
// 구글 서버가 리다이렉트해줘야만 드러난다. 서버에서 한 번 따라가 최종 주소를
// 얻은 뒤 다시 파싱한다. Next.js의 fetch는 같은 요청을 자동으로 캐시하므로,
// 페이지를 다시 열어도 이미 풀어본 링크는 네트워크를 다시 타지 않는다.
//
// 구글 도메인이 아닌 링크는 리다이렉트를 따라가지 않는다(임의의 외부 주소로
// 요청을 보내지 않기 위함).
export async function resolveMapEmbedSrc(mapUrl: string): Promise<string | null> {
  const direct = buildMapEmbedSrc(mapUrl);
  if (direct) return direct;

  let url: URL;
  try {
    url = new URL(mapUrl);
  } catch {
    return null;
  }
  if (!/(^|\.)google\.[a-z.]+$|(^|\.)goo\.gl$/.test(url.hostname)) return null;

  try {
    const response = await fetch(mapUrl, { redirect: "follow" });
    return buildMapEmbedSrc(response.url);
  } catch {
    return null;
  }
}
