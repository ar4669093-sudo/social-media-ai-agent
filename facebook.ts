import type { PublishInput, PublishResult } from "./types";

/** Placeholder only. Page publishing requires a Page token and approved permissions. */
export async function publishToFacebook(_input: PublishInput): Promise<PublishResult> {
  return { ok: false, reason: "Facebook publisher is not configured. Add Page OAuth/token, Graph API permissions and media handling first." };
}
