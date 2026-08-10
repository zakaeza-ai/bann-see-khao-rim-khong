import type { PromotionPostView } from "@/lib/data/content";

export function PromotionPostCard({ post }: { post: PromotionPostView }) {
  const images = post.media.filter((m) => m.media_type === "image");
  const videos = post.media.filter((m) => m.media_type === "video");
  const cover = images[0] ?? videos[0];

  return (
    <div className="resort-card overflow-hidden">
      <div className="aspect-video bg-river-50 dark:bg-[#16273a]">
        {cover?.media_type === "video" ? (
          <video
            src={cover.url}
            controls
            poster={images[0]?.url}
            className="w-full h-full object-cover"
          />
        ) : cover ? (
          <img src={cover.url} alt={post.title} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-river-900 dark:text-river-100">{post.title}</h3>
        {post.description && (
          <p className="text-sm text-river-600 dark:text-river-400 mt-1">{post.description}</p>
        )}

        {post.media.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto">
            {post.media
              .filter((m) => m.id !== cover?.id)
              .map((m) =>
                m.media_type === "image" ? (
                  <img key={m.id} src={m.url} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <video
                    key={m.id}
                    src={m.url}
                    poster={images[0]?.url}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                    muted
                  />
                )
              )}
          </div>
        )}
      </div>
    </div>
  );
}