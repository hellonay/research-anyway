import { randomUUID } from "crypto";

import type { Day, Item, Trip } from "./types";

// 사용자가 제공한 실제 골프 여행 엑셀(골프여행_일정.xlsx, 시트 "일정")에서 추출한 초기 데이터.
// 엑셀에는 정확한 날짜·구글맵 링크·사진이 없어 요일 라벨만 넣고 나머지는 앱에서 채운다.
function item(
  title: string,
  type: Item["type"],
  startTime: string | null,
  endTime: string | null,
  note: string | null = null
): Item {
  return {
    id: randomUUID(),
    title,
    type,
    startTime,
    endTime,
    note,
    mapUrl: null,
    photos: [],
    createdAt: Date.now(),
  };
}

function day(label: string, items: Item[]): Day {
  return { id: randomUUID(), label, items };
}

export function createSeedTrip(): Trip {
  return {
    title: "다낭 골프 여행",
    periodStart: null,
    periodEnd: null,
    coverImage: null,
    infoNotes: [],
    galleryPhotos: [],
    days: [
      day("목요일", [
        item("입국수속", "기타", null, "10:20"),
        item("이동 및 체크인", "이동수단", "10:20", "11:00"),
        item("맥주", "식당", "11:00", "12:00"),
      ]),
      day("금요일", [
        item("이동", "이동수단", "06:00", "07:10"),
        item("라운딩(피닉스 골프장)", "골프", "07:35", "12:30", "아침은 김밥으로"),
        item("점심", "식당", "12:30", "13:20", "골프장 클럽하우스"),
        item("이동", "이동수단", "12:30", "14:30"),
        item("쇼핑", "기타", "14:30", "15:30", "골프웨어"),
        item("맛사지", "기타", "15:30", "17:10"),
        item("저녁", "식당", "17:10", "18:40"),
        item("2차 맥주", "식당", "19:00", "21:00"),
      ]),
      day("토요일", [
        item("이동", "이동수단", "04:40", "05:30"),
        item("아침식사 및 이동", "식당", "05:30", "06:30", "라면"),
        item("라운딩(동몰골프장)", "골프", "06:30", "12:00"),
        item("이동", "이동수단", "12:00", "13:20"),
        item("점심", "식당", "13:20", "14:20", "베트남 음식"),
        item("쇼핑", "기타", "14:20", "15:30", "한국선물"),
        item("이발소", "기타", "15:30", "17:30"),
        item("저녁", "식당", "17:30", "19:30"),
        item("맛사지", "기타", "19:30", "20:30"),
        item("공항이동", "이동수단", "20:30", "21:10"),
      ]),
    ],
  };
}
