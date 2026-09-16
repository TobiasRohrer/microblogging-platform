import { useState } from "react";
import TimeLine from "../components/TimeLine";
import FollowerPage from "./FollowerPage";
import AccountPage from "./AccountPage";
import FollowingPage from "./FollowingPage";
import type { ActiveView } from "../components/types";
import PostFullViewPage from "./PostFullViewPage";
import { useAuthStore } from "../stores/AuthStore";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>({
    type: "TIMELINE",
  });
  const showAccount = (username: string) =>
    setActiveView({ type: "ACCOUNT", username });
  const showFollowers = (username: string) =>
    setActiveView({ type: "FOLLOWERS", username });
  const showFollowing = (username: string) =>
    setActiveView({ type: "FOLLOWING", username });
  const showTimeline = () => setActiveView({ type: "TIMELINE" });
  const showPost = (postId: number, username: string) =>
    setActiveView({ type: "POST", postId, username });
  const myUsername = useAuthStore.getState().username;
  const [boldText, setBoldText] = useState<string>("Home");

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1265px] mx-auto grid grid-cols-12 min-h-screen">
        <aside className="hidden md:flex md:col-span-3 p-4 flex-col justify-between border-r border-neutral-800">
          <div className="space-y-4">
            <nav className="text-lg font-semibold space-y-1">
              <div
                className={`px-4 py-3 rounded-full hover:bg-neutral-900 cursor-pointer w-fit ${boldText === "Home" ? "font-bold text-white" : "text-neutral-400"}`}
                onClick={() => {
                  showTimeline();
                  setBoldText("Home");
                }}
              >
                Home
              </div>
              <div
                className={`px-4 py-3 rounded-full hover:bg-neutral-900 cursor-pointer w-fit ${boldText === "Profile" ? "font-bold text-white" : "text-neutral-400"}`}
                onClick={() => {
                  myUsername && showAccount(myUsername);
                  setBoldText("Profile");
                }}
              >
                Profile
              </div>
            </nav>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-6 border-x border-neutral-800 min-h-screen bg-black">
          {(() => {
            switch (activeView.type) {
              case "TIMELINE":
                return (
                  <TimeLine
                    onSelectPost={showPost}
                    onSelectAccount={showAccount}
                  />
                );
              case "FOLLOWERS":
                return (
                  <FollowerPage
                    username={activeView.username}
                    onSelectAccount={showAccount}
                  />
                );
              case "FOLLOWING":
                return (
                  <FollowingPage
                    username={activeView.username}
                    onSelectAccount={showAccount}
                  />
                );
              case "ACCOUNT":
                return (
                  <AccountPage
                    username={activeView.username}
                    onSelectPost={showPost}
                    onSelectAccount={showAccount}
                    onSelectFollowing={showFollowing}
                    onSelectFollowers={showFollowers}
                  />
                );
              case "POST":
                return (
                  <PostFullViewPage
                    username={activeView.username}
                    postId={activeView.postId}
                    onSelectAccount={showAccount}
                    onSelectPost={showPost}
                  />
                );
            }
          })()}
        </main>

        <SearchBar onSelectAccount={showAccount}></SearchBar>
      </div>
    </div>
  );
}
