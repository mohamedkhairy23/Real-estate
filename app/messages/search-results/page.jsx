"use client";
import Message from "@/components/Message";
import MessagesFilter from "@/components/MessagesFilter";
import Spinner from "@/components/Spinner";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const MessagesSearchResultsPage = () => {
  const searchParams = useSearchParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const read = searchParams.get("read");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await fetch(`/api/messages/search?read=${read}`);
        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.log(`Error fetching search results properties:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [read]);

  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <>
      <section className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-start sm:px-6 lg:px-8">
          <MessagesFilter />
        </div>
        <div className="container m-auto py-12 max-w-6xl">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <h1 className="text-3xl font-bold mb-4">
              {read === "readMessages"
                ? "Read Messages"
                : "Unread(New) Messages"}
            </h1>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p>You have no messages</p>
              ) : (
                messages.map((message) => (
                  <Message key={message._id} message={message} />
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MessagesSearchResultsPage;
