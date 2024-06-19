"use client";
import { useState, useEffect } from "react";
import Spinner from "@/components/Spinner";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages");

        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.log(`Error fetching messages: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  console.log(messages);
  return <div>Messages</div>;
};

export default Messages;
