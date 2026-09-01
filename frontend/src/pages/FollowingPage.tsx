import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/AuthStore";
import { useState, useEffect } from "react";
import type { Account } from "../components/types";

interface Props {
  username: string;
  onSelectAccount: (username: string) => void;
}

export default function FollowingPage({ username, onSelectAccount }: Props) {
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  const [res, setRes] = useState<Account[]>([]);

  if (!username) {
    return <div>This user is not following anyone!</div>;
  }

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    getAccounts(username);
  }, []);

  async function getAccounts(username: string) {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/${username}/following`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Accounts");
      }
      setRes(await response.json());
    } catch (error) {
      console.log("FAILED TO GET ACCOUNTS!");
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-10 bg-black/70 backdrop-blur-md border-b border-neutral-800 px-4 py-3">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Following
        </h2>
      </div>
      <div>
        {res.map((account) => (
          <article
            key={account.id}
            className="p-4 hover:bg-white/[0.03] transition-colors border-b border-neutral-800 flex gap-3 cursor-pointer"
          >
            <div
              onClick={() => onSelectAccount(account.name)}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 hover:opacity-90 flex-shrink-0 flex items-center justify-center font-bold text-sm text-neutral-300"
            >
              {account.name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 leading-5 mb-1">
                <button
                  onClick={() => onSelectAccount(account.name)}
                  className="font-bold text-white hover:underline text-sm truncate"
                >
                  {account.name}
                </button>
                <span className="text-xs text-neutral-500 truncate">
                  @{account.name.toLowerCase()}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
