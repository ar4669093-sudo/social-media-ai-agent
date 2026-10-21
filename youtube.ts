import type { PublishInput, PublishResult } from "./types";

/**
 * Placeholder only. Production implementation must use Google OAuth 2.0 and
 * YouTube Data API videos.insert with an authorized channel and uploaded media.
 */
export async function publishToYouTube(_input: PublishInput): Promise<PublishResult> {
  return { ok: false, reason: "YouTube publisher is not configured. Add OAuth, YouTube Data API, video upload and quota handling first." };
}
