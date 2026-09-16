import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import type { SearchResponse } from "./types";

interface Props {
  onSelectAccount: (username: string) => void;
}

export default function SearchBar({ onSelectAccount }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useAuthStore.getState().token;
  const navigate = useNavigate();
  const [res, setRes] = useState<SearchResponse[]>([]);

  function handleInvalidLogin() {
    navigate(`/login`);
  }

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      getSearchResult();
    } else {
      setRes([]);
    }
  }, [searchTerm]);

  async function getSearchResult() {
    try {
      if (!token) {
        handleInvalidLogin();
        return;
      }
      const jwtToken = "Bearer " + token;
      const response = await fetch(`/api/accounts/search/${searchTerm}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: jwtToken,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get Search Results");
      }
      setRes(await response.json());
    } catch (error) {
      console.log("FAILED TO GET SEARCH RESULTS!");
    }
  }

  return (
    <aside className="hidden md:block md:col-span-3 px-4 py-3 border-l border-neutral-800 sticky top-0 h-screen">
      <div className="relative w-full">
        {/* Search Input Container */}
        <div className="group relative flex items-center w-full rounded-full bg-neutral-900 border border-transparent focus-within:border-sky-500 focus-within:bg-black transition-colors duration-200">
          {/* Magnifying Glass Icon */}
          <div className="pl-4 pr-3 text-neutral-500 group-focus-within:text-sky-500 transition-colors pointer-events-none flex items-center">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="w-4 h-4 fill-current"
            >
              <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.48 0 2.85-.49 3.96-1.32l4.63 4.63a.75.75 0 1 0 1.06-1.06l-4.63-4.63c.83-1.11 1.32-2.48 1.32-3.96 0-3.59-2.91-6.5-6.5-6.5zm-5 6.5c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z" />
            </svg>
          </div>

          <input
            type="text"
            className="w-full bg-transparent py-2.5 pr-4 text-sm text-neutral-100 placeholder-neutral-500 outline-none"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clear Button (appears when typing) */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mr-3 p-1 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-300 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
              </svg>
            </button>
          )}
        </div>

        {searchTerm.trim().length > 2 && (
          <div className="absolute left-0 right-0 mt-1 bg-black border border-neutral-800 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.1)] overflow-hidden z-50">
            {res.length > 0 ? (
              <ul className="divide-y divide-neutral-900">
                {res.map((search) => (
                  <li
                    key={search.name}
                    onClick={() => {
                      setSearchTerm("");
                      onSelectAccount(search.name);
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-900/70 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex-shrink-0 flex items-center justify-center font-bold text-sm text-neutral-300 uppercase">
                      {search.name.charAt(0)}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-neutral-100 hover:underline truncate">
                        {search.name}
                      </span>
                      <span className="text-xs text-neutral-500 truncate">
                        @{search.name.toLowerCase().replace(/\s+/g, "")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-sm text-neutral-500">
                No results for &ldquo;{searchTerm}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
