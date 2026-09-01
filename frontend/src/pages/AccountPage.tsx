import { useAuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FollowButton from "../components/FollowButton";
import PostComponent from "../components/PostComponent";
import type { Account } from "../components/types";

interface Props {
  username: string;
  onSelectPost: (postId: number, username: string) => void;
  onSelectAccount: (username: string) => void;
  onSelectFollowing: (username: string) => void;
  onSelectFollowers: (username: string) => void;
}

export default function AccountPage({
  username,
  onSelectPost,
  onSelectAccount,
  onSelectFollowing,
  onSelectFollowers,
}: Props) {
  const token = useAuthStore.getState().token;
  const myUsername = useAuthStore.getState().username;
  const navigate = useNavigate();
  const [res, setRes] = useState<Account>();

  if (!username) {
    return <div>This Account does not exist!</div>;
  }

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    getAccount(username);
  }, []);

  async function getAccount(username: string) {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/accounts/${username}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Account");
      }
      setRes(await response.json());
    } catch (error) {
      console.log("FAILED TO GET Account!");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {res ? (
        <div>
          <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-md px-4 py-2 border-b border-neutral-800 flex items-center gap-6">
            <div>
              <h1 className="text-xl font-bold leading-tight text-white">
                {res.name}
              </h1>
              <p className="text-xs text-neutral-500">
                {res.posts.length} posts
              </p>
            </div>
          </div>

          <div className="h-36 bg-neutral-900 relative"></div>
          <div className="px-4 pb-4 border-b border-neutral-800 relative">
            <div className="flex justify-between items-end -mt-14 mb-4">
              <div className="w-28 h-28 rounded-full bg-black border-4 border-black ring-1 ring-neutral-800 flex items-center justify-center text-4xl font-bold text-neutral-300">
                {res.name.charAt(0).toUpperCase()}
              </div>
              {myUsername !== res.name && <FollowButton username={res.name} />}
            </div>

            <div className="mb-3">
              <h2 className="text-xl font-bold leading-tight text-white">
                {res.name}
              </h2>
              <p className="text-sm text-neutral-500">
                @{res.name.toLowerCase()}
              </p>
            </div>

            <div className="flex gap-4 text-sm text-neutral-500">
              <span onClick={() => onSelectFollowing(res.name)}>
                <strong className="text-white font-semibold">
                  {res.followingCount}
                </strong>{" "}
                Following
              </span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => onSelectFollowers(res.name)}
              >
                <strong className="text-white font-semibold">
                  {res.followersCount}
                </strong>{" "}
                Followers
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            {res.posts.map((post) => (
              <PostComponent
                key={post.id}
                post={post}
                onSelectPost={() => onSelectPost(post.id, post.authorName)}
                onSelectAccount={() => onSelectAccount(post.authorName)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-neutral-500">
          <h2 className="text-lg font-semibold">This account doesn’t exist</h2>
          <p className="text-xs text-neutral-600 mt-1">
            Try searching for another.
          </p>
        </div>
      )}
    </div>
  );
}
