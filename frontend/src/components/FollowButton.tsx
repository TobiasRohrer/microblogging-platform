import { useAuthStore } from "../stores/AuthStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  username: string;
}

interface FollowResponse {
  isFollowing: boolean;
}

export default function FollowButton({ username }: Props) {
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  const [res, setRes] = useState<FollowResponse>();

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    if (!token) {
      navigate(`/login`);
      return;
    }
    getFollowing();
  }, [token]);

  async function getFollowing() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/accounts/${username}/isFollowing`, {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Following");
      }
      const data = await response.json();
      setRes(data);
    } catch (error) {
      console.error("Get Follow failed, reverting:", error);
    }
  }

  async function follow() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const followMethod: string = res?.isFollowing ? "DELETE" : "POST";
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/accounts/${username}/followers`, {
        method: followMethod,
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to follow");
      }
      const data = await response.json();
      setRes(data);
    } catch (error) {
      console.error("Follow failed, reverting:", error);
    }
  }

  return (
    <>
      {res && (
        <button
          onClick={() => follow()}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
            res.isFollowing
              ? "border border-neutral-700 text-white hover:border-red-600 hover:text-red-500 hover:bg-red-950/20"
              : "bg-white text-black hover:bg-neutral-200"
          }`}
        >
          {res.isFollowing ? "Following" : "Follow"}
        </button>
      )}
      {!res && (
        <button
          onClick={() => follow()}
          className="px-4 py-1.5 rounded-full text-sm font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
        >
          Follow
        </button>
      )}
    </>
  );
}