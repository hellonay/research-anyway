// 패널이 늘어나도 순환하도록 파스텔 톤 5가지를 돌려쓴다. 헤더 hover는 각 톤에 맞춰 한 단계 진하게 잡았다.
// Day 패널, 사람 패널 등 접이식 패널 목록에서 공통으로 쓴다.
const PANEL_COLORS = [
  "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-950/40 [&_summary:hover]:bg-sky-100 dark:[&_summary:hover]:bg-sky-900/40",
  "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 [&_summary:hover]:bg-amber-100 dark:[&_summary:hover]:bg-amber-900/40",
  "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 [&_summary:hover]:bg-emerald-100 dark:[&_summary:hover]:bg-emerald-900/40",
  "border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/40 [&_summary:hover]:bg-violet-100 dark:[&_summary:hover]:bg-violet-900/40",
  "border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-950/40 [&_summary:hover]:bg-rose-100 dark:[&_summary:hover]:bg-rose-900/40",
];

export function panelColor(index: number): string {
  return PANEL_COLORS[index % PANEL_COLORS.length];
}
