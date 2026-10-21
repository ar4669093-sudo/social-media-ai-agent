import type { PublishInput, PublishResult } from "./types";

/**
 * Placeholder only. Instagram publishing needs eligible Professional account,
 * linked Meta assets, media accessible to Meta, access token and permissions.
 */
export async function publishToInstagram(_input: PublishInput): Promise<PublishResult> {
  return { ok: false, reason: "Instagram publisher is not configured. Add Meta Graph API OAuth, media hosting and permissions first." };
}
