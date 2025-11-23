"use client";

import { FormEvent, useMemo, useState } from "react";

const captionLimit = 2200;

type PublishResponse = {
  ok: boolean;
  message?: string;
  error?: string;
  details?: {
    mediaId?: string;
  };
};

const presetCaptions = [
  "Launching our new collection today! Tap the link in bio to explore.",
  "Behind the scenes from today's shoot. Drop a 🔥 if you love it!",
  "Counting down to our next big release. Stay tuned!"
];

const presetImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
];

export default function Page() {
  const [caption, setCaption] = useState(presetCaptions[0]);
  const [imageUrl, setImageUrl] = useState(presetImages[0]);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<PublishResponse | null>(null);

  const captionCharactersLeft = useMemo(
    () => Math.max(captionLimit - caption.length, 0),
    [caption]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setResponse(null);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, imageUrl })
      });

      const data: PublishResponse = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while contacting the server"
      });
    } finally {
      setSubmitting(false);
    }
  }

  function applyPreset(index: number) {
    setCaption(presetCaptions[index]);
    setImageUrl(presetImages[index]);
    setResponse(null);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16">
      <header className="space-y-6 text-center">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-4 py-1 text-sm font-medium text-slate-300">
          <span className="inline-flex size-2 rounded-full bg-emerald-400" aria-hidden />
          Real-time Instagram Publishing
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Automate Instagram Publishing with InstaFlow
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-slate-300">
          Prepare your media, craft captivating captions, and push content live to your
          Instagram Business account instantly. Configure your Instagram tokens once and
          let InstaFlow handle the heavy lifting.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-slate-950/40"
        >
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="imageUrl" className="text-sm font-medium text-slate-200">
                Image URL
              </label>
              <button
                type="button"
                onClick={() => applyPreset((Math.random() * presetImages.length) | 0)}
                className="text-sm font-medium text-sky-400 hover:text-sky-300"
              >
                Randomize
              </button>
            </div>
            <input
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              required
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring focus:ring-sky-500/30"
            />
            <p className="mt-1 text-xs text-slate-400">
              Instagram will fetch your media from this public URL; ensure it is accessible and
              at least 1080x1080.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="caption" className="text-sm font-medium text-slate-200">
                Caption
              </label>
              <span className="text-xs font-medium text-slate-400">
                {captionCharactersLeft} characters remaining
              </span>
            </div>
            <textarea
              id="caption"
              name="caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              required
              rows={8}
              className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring focus:ring-sky-500/30"
              maxLength={captionLimit}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {submitting ? "Publishing to Instagram…" : "Publish Now"}
          </button>

          {response && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                response.ok
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/50 bg-rose-500/10 text-rose-200"
              }`}
            >
              {response.ok ? response.message : response.error}
              {response.ok && response.details?.mediaId && (
                <p className="mt-1 text-xs text-emerald-200/80">
                  Media ID: {response.details.mediaId}
                </p>
              )}
            </div>
          )}
        </form>

        <aside className="flex flex-col gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-lg font-semibold text-white">Setup Checklist</h2>
          <ol className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-semibold text-slate-200">
                1
              </span>
              <p>
                Convert your Instagram account to a Business account and link it to a Facebook
                Page.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-semibold text-slate-200">
                2
              </span>
              <p>
                Generate a long-lived Instagram Graph API access token with the
                <span className="font-semibold"> instagram_basic </span>and
                <span className="font-semibold"> pages_manage_posts </span> permissions.
              </p>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 inline-flex size-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 font-semibold text-slate-200">
                3
              </span>
              <p>
                Set <code>INSTAGRAM_ACCESS_TOKEN</code> and <code>INSTAGRAM_IG_USER_ID</code> in
                your Vercel project environment before deploying.
              </p>
            </li>
          </ol>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-200">Preview</p>
            <p className="mt-2">
              Use the preview on the left to validate your caption and media before automating
              large content campaigns.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
