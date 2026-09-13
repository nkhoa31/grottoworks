// Helper định dạng dùng chung — ISO yyyy-mm-dd → dd/MM/yyyy.
export const viDate = (iso: string) =>
  iso.length >= 10 ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : iso
