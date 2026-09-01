import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";
import { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import PostField from "./PostField";
import type { Post } from "./types";

interface Props {
  onSelectPost: (postId: number, username: string) => void;
  onSelectAccount: (username: string) => void;
}

export default function TimeLine({ onSelectAccount, onSelectPost }: Props) {
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  const [res, setRes] = useState<Post[]>([]);

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    getTimeLine();
  }, []);

  async function getTimeLine() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch("/api/accounts/home", {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: jwtToken,
        },
      });
      setRes(await response.json());
    } catch (error) {
      console.log("FAILED TO GET TimeLine!");
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xl font-bold text-white tracking-tight">Home</h2>
      </div>

      <PostField />

      <div>
        {res.map((post) => (
          <PostComponent
            key={post.id}
            post={post}
            onSelectPost={() => onSelectPost(post.id, post.authorName)}
            onSelectAccount={() => onSelectAccount(post.authorName)}
          />
        ))}
      </div>
    </div>
  );
}
