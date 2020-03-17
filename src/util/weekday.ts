export function getWeekday(timestampUnix: number) {
  const tmp = new Date(timestampUnix * 1000);
  const days = ['niedz.', 'pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.'];
  return days[tmp.getDay()];
}

export default getWeekday;
