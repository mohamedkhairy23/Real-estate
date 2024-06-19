"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const PropertyContactForm = ({ property }) => {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [body, setBody] = useState("");
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const handleSubmitSendingMessage = async () => {
    const messageBody = {
      name,
      email,
      phone,
      body,
      recipient: property.owner,
      property: property._id,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageBody),
      });

      const jsonData = await res.json();
      if (res.status === 200) {
        toast.success(jsonData.message);
        setWasSubmitted(true);
      } else if (res.status === 400 || res.status === 401) {
        toast.error(jsonData.message);
        console.log(res);
      } else {
        toast.error("Error sending message");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error sending message");
    } finally {
      setName("");
      setEmail("");
      setPhone("");
      setBody("");
    }
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-xl font-bold mb-6">Contact Property Manager</h3>
      {!session ? (
        <p>You must be logged in to send a message</p>
      ) : wasSubmitted ? (
        <p className="text-green-500 mb-4">
          Your message has been sent successfully!
        </p>
      ) : (
        <form onSubmit={handleSubmit(handleSubmitSendingMessage)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="name"
            >
              Name:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              {...register("name", {
                required: true,
                minLength: 3,
                maxLength: 100,
                onChange: (e) => {
                  setName(e.target.value);
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm font-bold">
                {errors.name.type === "minLength" &&
                  "Your name must be at least 3 characters long"}
                {errors.name.type === "maxLength" &&
                  "Your name must be less than 100 characters long"}
                {errors.name.type === "required" && "This field is required"}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="email"
            >
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              {...register("email", {
                required: true,
                pattern:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                onChange: (e) => {
                  setEmail(e.target.value);
                },
              })}
            />
            {errors?.email && (
              <span className="text-red-500 text-sm font-bold">
                {errors?.email?.type === "required" && "This field is required"}
                {errors?.email?.type === "pattern" && "Invalid email address"}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="phone"
            >
              Phone:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              name="phone"
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              {...register("phone", {
                required: true,
                pattern: /^01[0125][0-9]{8}$/,
                onChange: (e) => {
                  setPhone(e.target.value);
                },
              })}
            />
            {errors?.phone && (
              <span className="text-red-500 text-sm font-bold">
                {errors?.phone.type === "required" && "This field is required"}
                {errors?.phone.type === "pattern" && "Invalid phone number"}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              for="body"
            >
              Message Body:
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-44 focus:outline-none focus:shadow-outline"
              id="body"
              name="body"
              placeholder="Enter your message"
              value={body}
              {...register("body", {
                required: true,
                minLength: 20,
                maxLength: 300,
                onChange: (e) => {
                  setBody(e.target.value);
                },
              })}
            ></textarea>
            {errors.body && (
              <span className="text-red-500 text-sm font-bold">
                {errors.body.type === "minLength" &&
                  "Your message must be at least 20 characters long"}
                {errors.body.type === "maxLength" &&
                  "Your message must be less than 300 characters long"}
                {errors.body.type === "required" && "This field is required"}
              </span>
            )}
          </div>
          <div>
            <button
              disabled={isSubmitting}
              className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline flex items-center justify-center ${
                isSubmitting ? "" : "hover:bg-blue-600"
              }`}
              type="submit"
            >
              <FaPaperPlane className="mr-2" />{" "}
              {isSubmitting ? "Loading..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PropertyContactForm;
