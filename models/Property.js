import { Schema, model, models } from "mongoose";

const PropertySchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short property name"],
      maxlength: [100, "Too long property name"],
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "Too short property name"],
      maxlength: [300, "Too long property name"],
    },
    location: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipcode: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },
    beds: {
      type: Number,
      required: true,
      min: 1,
    },
    baths: {
      type: Number,
      required: true,
      min: 1,
    },
    square_feet: {
      type: Number,
      required: true,
      min: 20,
    },
    amenities: [
      {
        type: String,
        required: true,
      },
    ],
    rates: {
      nightly: {
        type: Number,
        min: 20,
      },
      weekly: {
        type: Number,
        min: 120,
      },
      monthly: {
        type: Number,
        min: 450,
      },
    },
    seller_info: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: [
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
          "Please add a valid email",
        ],
      },
      phone: {
        type: String,
        required: true,
        match: [/^01[0125][0-9]{8}$/, "Please add a valid phone number"],
      },
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Property = models.Property || model("Property", PropertySchema);

export default Property;
