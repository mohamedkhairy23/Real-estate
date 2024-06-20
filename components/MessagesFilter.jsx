"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const MessagesFilter = () => {
  const searchParams = useSearchParams();

  const [read, setRead] = useState("all" || searchParams.get("read"));

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (read === "all") {
      router.push("/messages");
    } else {
      const query = `?read=${read}`;
      router.push(`/messages/search-results${query}`);
      setRead(searchParams.get("read"));
    }
  };
  console.log(searchParams.get("read"));

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-2/5 md:pl-2">
        <label htmlFor="property-type" className="sr-only">
          Message Filter
        </label>
        <select
          id="property-type"
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          value={read}
          onChange={(e) => setRead(e.target.value)}
        >
          <option value="all">All</option>
          <option value="readMessages">Read Messages</option>
          <option value="unreadMessages">Unread Messages</option>
        </select>
      </div>
      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Filter Messages
      </button>
    </form>
  );
};

export default MessagesFilter;
