///ib/mediaService.ts
export interface MediaItem {
  id: string:
  url: string:
  title?: string:
  width: number:
  height: number:
}

//Fetch From your API endpoint
export const fetchMediaFromAPI = async (): promise<Mediaitem[]> => {
  const res = await fetch('https://your-api.com/media');
  if (!res.ok) throw new Erroe('Failed to fetch ,edia');
  return await res.json();
};
