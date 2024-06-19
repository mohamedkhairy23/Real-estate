import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Too short property name"],
      maxlength: [100, "Too long property name"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^01[0125][0-9]{8}$/, "Please add a valid phone number"],
    },
    body: {
      type: String,
      required: [true, "Message is required"],
      minlength: [20, "Too short property name"],
      maxlength: [300, "Too long property name"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = models.Message || model("Message", MessageSchema);

export default Message;
