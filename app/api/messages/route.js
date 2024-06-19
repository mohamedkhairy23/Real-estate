import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// POST /api/messages
export const POST = async (request) => {
  try {
    await connectDB();

    const { name, email, phone, body, property, recipient } =
      await request.json();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.user) {
      return new Response(
        JSON.stringify({
          message: "you must to be logged in to send a message",
        }),
        {
          status: 401,
        }
      );
    }

    const { user } = sessionUser;

    // Can not send message to self
    if (user.id === recipient) {
      return new Response(
        JSON.stringify({ message: "Can not send a message to yourself!" }),
        {
          status: 400,
        }
      );
    }

    const newMessage = await Message.create({
      sender: user.id,
      name,
      email,
      phone,
      body,
      property,
      recipient,
    });

    newMessage.save();

    return new Response(
      JSON.stringify({ message: "Message sent successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};
