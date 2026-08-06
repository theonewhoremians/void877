export type InstagramImportResponse = {
  success: true;
  source: string;
  reel: {
    shortcode: string | null; url: string | null; username: string | null; fullName: string | null;
    profilePicture: string | null; verified: boolean | null; caption: string | null; hashtags: string[];
    mentions: string[]; thumbnail: string | null; videoUrl: string | null; duration: number | null;
    width: number | null; height: number | null; uploadDate: string | null; audioTitle: string | null;
    audioArtist: string | null; likes: number | null; comments: number | null; views: number | null; reposts: number | null;
    shares: number | null; saves: number | null;
  };
} | { success: false; error: string; retryable: boolean };

export async function importPublicInstagramReel(url: string) {
  const response = await fetch("/api/import-instagram", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url }) });
  const result = await response.json() as InstagramImportResponse;
  if (!result.success) throw Object.assign(new Error(result.error), { retryable: result.retryable });
  return result;
}
