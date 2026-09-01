import { useAuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PostComponent from "../components/PostComponent";
import { LikeButton } from "../components/LikeButton";
import CommentField from "../components/CommentField";
import type { Post } from "../components/types";

interface Props {
  postId: number;
  username: string;
  onSelectPost: (id: number, username: string) => void;
  onSelectAccount: (username: string) => void;
}

export default function PostFullViewPage({
  postId,
  username,
  onSelectAccount,
  onSelectPost,
}: Props) {
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  const [res, setRes] = useState<Post[]>();
  const [parentPost, setParentPost] = useState<Post>();

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    getPost();
    getComments();
  }, [postId, username]);

  async function getPost() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Post");
      }
      setParentPost(await response.json());
    } catch (error) {
      console.log("FAILED TO GET POST!");
    }
  }

  async function getComments() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Comments");
      }
      setRes(await response.json());
    } catch (error) {
      console.log("FAILED TO GET COMMENTS!");
    }
  }

  function backArrow() {
    if (parentPost?.parentPost) {
      onSelectPost(parentPost.parentPost.id, parentPost.parentPost.authorName);
    } else {
      onSelectAccount(username);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-md px-4 py-3 border-b border-neutral-800 flex items-center gap-6">
        <button
          onClick={backArrow}
          className="hover:bg-neutral-900 p-2 rounded-full transition-colors cursor-pointer"
          aria-label="Back"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-5 h-5 fill-white"
          >
            <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
          </svg>
        </button>
        <h2 className="text-xl font-bold tracking-tight text-white">Post</h2>
      </div>

      {parentPost ? (
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center gap-3 mb-3">
            <div
              onClick={() => onSelectAccount(parentPost.authorName)}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:opacity-90 flex-shrink-0 flex items-center justify-center font-bold text-sm text-neutral-300 cursor-pointer"
            >
              {parentPost.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div
                onClick={() => onSelectAccount(parentPost.authorName)}
                className="font-bold text-white hover:underline leading-tight cursor-pointer text-sm"
              >
                {parentPost.authorName}
              </div>
              <div className="text-xs text-neutral-500">
                @{parentPost.authorName.toLowerCase()}
              </div>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-neutral-100 whitespace-pre-line break-words mb-4">
            {parentPost.content}
          </p>

          <div className="text-xs text-neutral-500 pb-3 border-b border-neutral-800">
            {parentPost.postDate || "Just now"}
          </div>

          <div className="py-2.5 flex items-center text-neutral-500 -ml-2">
            <LikeButton
              postId={parentPost.id.toString()}
              initialCount={parentPost.likes}
              initialLiked={parentPost.isLiked}
            />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-500 text-sm">
          Loading post...
        </div>
      )}

      {parentPost ? (
        <div>
          <CommentField
            postId={parentPost.id}
          />
        </div>
      ) : (
        <div className="p-8 text-center text-neutral-500 text-sm">
          Loading post...
        </div>
      )}

      <div>
        {res && res.length > 0 ? (
          res.map((comment) => (
            <PostComponent
              key={comment.id}
              post={comment}
              onSelectPost={() => onSelectPost(comment.id, comment.authorName)}
              onSelectAccount={() => onSelectAccount(comment.authorName)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-neutral-500 text-xs">
            No replies yet
          </div>
        )}
      </div>
    </div>
  );
}
