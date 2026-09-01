import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";

interface LikeButtonProps {
  initialLiked?: boolean;
  initialCount?: number;
  postId: string;
}

export function LikeButton({
  initialLiked = false,
  initialCount = 0,
  postId,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = useAuthStore.getState().token;

  const toggleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    if (isLoading) return;
    setIsLoading(true);

    function handleInvalidLogin() {
      navigate(`/login`);
    }

    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: newLikedState ? "POST" : "DELETE",
        headers: {
          Authorization: jwtToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to save like");
      }
    } catch (error) {
      setIsLiked(!newLikedState);
      setLikeCount((prev) => (!newLikedState ? prev + 1 : prev - 1));
      console.error("Like failed, reverting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`group flex items-center gap-1.5 p-1 rounded-full text-xs font-normal transition-colors cursor-pointer ${
        isLiked
          ? "text-rose-600"
          : "text-neutral-500 hover:text-rose-600"
      }`}
      aria-label={isLiked ? "Unlike post" : "Like post"}
      aria-pressed={isLiked}
    >
      <div className="p-1.5 rounded-full group-hover:bg-rose-600/10 transition-colors">
        <Heart
          className={`w-4 h-4 transition-transform active:scale-125 ${
            isLiked ? "fill-current text-rose-600" : ""
          }`}
        />
      </div>
      <span className="text-xs">{likeCount}</span>
    </button>
  );
}