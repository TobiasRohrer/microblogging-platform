import { useAuthStore } from "../stores/AuthStore";
import { useState } from "react";

export default function PostField() {
  const token = useAuthStore.getState().token;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  function handlePostLength(value: string) {
    if(value.length <= 280) {
      setErrorMessage("");
      setContent(value);
    } else {
      setErrorMessage("Post can only contain 280 characters!");
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    if (!content.trim()) {
      setErrorMessage("Post can not be empty!");
      return;
    }
    post();
  };

  async function post() {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          content: content,
        }),
      });
      if (!response.ok) {
        setErrorMessage("Failed to post!");
        throw new Error("Failed to post!");
      }
      setContent("");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="border-b border-neutral-800 p-4 bg-black">
      {errorMessage && (
        <div className="mb-3 p-2.5 rounded-lg text-xs bg-red-950/40 text-red-400 border border-red-900/60">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-sm text-neutral-400 shrink-0">
          U
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => handlePostLength(e.target.value)}
            placeholder="What is happening?!"
            rows={3}
            className="w-full bg-transparent text-white placeholder-neutral-500 text-lg resize-none focus:outline-none border-none p-0 leading-relaxed"
          />
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-500 text-sm">
              <span className="text-xs text-neutral-600">
                {content.length > 0 && `${280 - content.length}`}
              </span>
            </div>
            <button
              type="submit"
              disabled={!content.trim()}
              className="bg-white hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white text-black font-bold text-sm px-4 py-1.5 rounded-full transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
