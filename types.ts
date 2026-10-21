export type PublishInput = {
  title: string;
  body: string;
  mediaUrls?: string[];
};

export type PublishResult =
  | { ok: true; platformPostId: string; url?: string }
  | { ok: false; reason: string };
