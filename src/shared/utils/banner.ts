export interface BannerLike {
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export const isBannerVisible = (banner: BannerLike, now: number = Date.now()): boolean => {
  if (!banner.isActive) return false;
  const start = new Date(banner.startDate).getTime();
  const end = new Date(banner.endDate).getTime();
  return now >= start && now < end;
};
