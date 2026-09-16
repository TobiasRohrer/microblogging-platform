import { LikeButton } from "./LikeButton";
import type { Post } from "./types";
import { MessageCircle } from "lucide-react";

interface Props {
  post: Post;
  onSelectPost: (postId: number) => void;
  onSelectAccount: (username: string) => void;
}

export default function PostComponent({
  post,
  onSelectAccount,
  onSelectPost,
}: Props) {
  return (
    <article className="p-4 hover:bg-white/[0.03] transition-colors border-b border-neutral-800 flex gap-3 cursor-pointer">
      <div
        onClick={() => onSelectAccount(post.authorName)}
        className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:opacity-90 flex-shrink-0 flex items-center justify-center font-bold text-sm text-neutral-300"
      >
        {post.authorName.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 leading-5 mb-1">
          <button
            onClick={() => onSelectAccount(post.authorName)}
            className="font-bold text-white hover:underline text-sm truncate"
          >
            {post.authorName}
          </button>
          <span
            className="text-xs text-neutral-500 truncate"
            onClick={() => onSelectPost(post.id)}
          >
            @{post.authorName.toLowerCase()}
          </span>
          <span
            className="text-xs text-neutral-600"
            onClick={() => onSelectPost(post.id)}
          >
            ·
          </span>
          <span
            className="text-xs text-neutral-500 hover:underline"
            onClick={() => onSelectPost(post.id)}
          >
            {post.postDate || "now"}
          </span>
        </div>

        <p
          className="text-[15px] leading-normal text-neutral-100 whitespace-pre-line break-words mb-2"
          onClick={() => onSelectPost(post.id)}
        >
          {post.content}
        </p>

        <div className="flex items-center text-neutral-500 -ml-2">
          <div className="p-1.5 rounded-full" onClick={() => onSelectPost(post.id)}>
            <MessageCircle className={`w-4 h-4`} />
          </div>
          <span>{post.comments}</span>
          <LikeButton
            postId={post.id.toString()}
            initialCount={post.likes}
            initialLiked={post.isLiked}
          />
        </div>
      </div>
    </article>
  );
}
