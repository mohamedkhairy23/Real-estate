"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PropertyAddForm = () => {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState({
    type: "",
    name: "",
    description: "",
    location: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
    },
    beds: "",
    baths: "",
    square_feet: "",
    amenities: [],
    rates: {
      weekly: "",
      monthly: "",
      nightly: "",
    },
    seller_info: {
      name: "",
      email: "",
      phone: "",
    },
    images: [],
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the name includes a dot, then it's a nested property
    if (name.includes(".")) {
      const [outerKey, innerKey] = name.split(".");
      setFields((prevFields) => ({
        ...prevFields,
        [outerKey]: {
          ...prevFields[outerKey],
          [innerKey]: value,
        },
      }));
    } else {
      // If not nested property, then set the value to the field object
      setFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;

    // Getting the current array
    const updatedAmenities = [...fields.amenities];

    if (checked) {
      // If checked then, adding value to array
      updatedAmenities.push(value);
    } else {
      // Remove value from array
      const index = updatedAmenities.indexOf(value);
      updatedAmenities.splice(index, 1);
    }

    // Update state with updated array
    setFields((prevFields) => ({
      ...prevFields,
      amenities: updatedAmenities,
    }));
  };

  const handleDelete = (e, imageUrl) => {
    setFields((prevFields) => ({
      ...prevFields,
      images: fields.images.filter((url) => url !== imageUrl),
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;

    // Getting images array
    const updatedImages = [...fields.images];

    // Add new files to the array
    for (const file of files) {
      if (updatedImages.length < 4) updatedImages.push(file);
    }

    // Update state with updated array
    setFields((prevFields) => ({
      ...prevFields,
      images: updatedImages,
    }));
  };

  const handleSubmitAddProperty = async (e) => {
    try {
      const formData = new FormData(e.target);
      formData.append("name", fields.name);
      formData.append("description", fields.description);
      formData.append("type", fields.type);
      formData.append("location.street", fields.location.street);
      formData.append("location.state", fields.location.state);
      formData.append("location.city", fields.location.city);
      formData.append("location.zipcode", fields.location.zipcode);
      formData.append("beds", fields.beds);
      formData.append("baths", fields.baths);
      formData.append("square_feet", fields.square_feet);
      formData.append("rates.nightly", fields.rates.nightly);
      formData.append("rates.weekly", fields.rates.weekly);
      formData.append("rates.monthly", fields.rates.monthly);
      formData.append("seller_info.name", fields.seller_info.name);
      formData.append("seller_info.email", fields.seller_info.email);
      formData.append("seller_info.phone", fields.seller_info.phone);

      fields.amenities.map((amenity) => {
        formData.append("amenities", amenity);
      });
      fields.images.map((image) => {
        formData.append("images", image);
      });

      // Handle the case where the domain is not available yet
      if (!apiDomain) {
        return [];
      }

      const res = await fetch(`/api/properties`, {
        method: "POST",
        body: formData,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success("Property added successfully");
        setFields({
          type: "",
          name: "",
          description: "",
          location: {
            street: "",
            city: "",
            state: "",
            zipcode: "",
          },
          beds: "",
          baths: "",
          square_feet: "",
          amenities: [],
          rates: {
            weekly: "",
            monthly: "",
            nightly: "",
          },
          seller_info: {
            name: "",
            email: "",
            phone: "",
          },
          images: [],
        });
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Permission denied");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <form
        action={handleSubmit(handleSubmitAddProperty)}
        // action="/api/properties"
        // method="POST"
        // encType="multipart/form-data"
      >
        <h2 className="text-3xl text-center font-semibold mb-6">
          Add Property
        </h2>
        <div className="mb-4">
          <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            className="border rounded w-full py-2 px-3"
            required=""
            value={fields.type}
            {...register("type", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          >
            <option value="">Select Property Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Condo">Condo</option>
            <option value="House">House</option>
            <option value="Cabin Or Cottage">Cabin or Cottage</option>
            <option value="Room">Room</option>
            <option value="Studio">Studio</option>
            <option value="Other">Other</option>
          </select>{" "}
          {errors.type && (
            <span className="text-red-500 text-sm font-bold">
              {errors.type.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Listing Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="eg. Beautiful Apartment In Miami"
            required=""
            value={fields.name}
            {...register("name", {
              required: true,
              minLength: 3,
              maxLength: 100,
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors.name && (
            <span className="text-red-500 text-sm font-bold">
              {errors.name.type === "minLength" &&
                "Property name must be at least 3 characters long"}
              {errors.name.type === "maxLength" &&
                "Property name must be less than 100 characters long"}
              {errors.name.type === "required" && "This field is required"}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="border rounded w-full py-2 px-3"
            rows={4}
            placeholder="Add an optional description of your property"
            value={fields.description}
            {...register("description", {
              required: true,
              minLength: 20,
              maxLength: 300,
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-sm font-bold">
              {errors.description.type === "minLength" &&
                "Property description must be at least 20 characters long"}
              {errors.description.type === "maxLength" &&
                "Property description must be less than 300 characters long"}
              {errors.description.type === "required" &&
                "This field is required"}
            </span>
          )}
        </div>
        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">Location</label>{" "}
          <input
            type="text"
            id="street"
            name="location.street"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Street"
            value={fields?.location?.street}
            {...register("location.street", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.location?.street && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.location?.street?.message}
            </span>
          )}
          <input
            type="text"
            id="city"
            name="location.city"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="City"
            required=""
            value={fields?.location?.city}
            {...register("location.city", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.location?.city && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.location?.city?.message}
            </span>
          )}
          <input
            type="text"
            id="state"
            name="location.state"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="State"
            required=""
            value={fields?.location?.state}
            {...register("location.state", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.location?.state && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.location?.state?.message}
            </span>
          )}
          <input
            type="text"
            id="zipcode"
            name="location.zipcode"
            className="border rounded w-full py-2 px-3 mb-2"
            placeholder="Zipcode"
            value={fields?.location?.zipcode}
            {...register("location.zipcode", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.location?.zipcode && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.location?.zipcode?.message}
            </span>
          )}
        </div>
        <div className="mb-4 flex flex-wrap">
          <div className="w-full sm:w-1/3 pr-2">
            <label
              htmlFor="beds"
              className="block text-gray-700 font-bold mb-2"
            >
              Beds
            </label>
            <input
              type="number"
              id="beds"
              name="beds"
              className="border rounded w-full py-2 px-3"
              required=""
              value={fields.beds}
              min={1}
              {...register("beds", {
                required: "This field is required",
                onChange: (e) => {
                  handleChange(e);
                },
              })}
            />
            {errors?.beds?.message && (
              <span className="text-red-500 text-sm font-bold">
                {errors.beds?.message}
              </span>
            )}
          </div>
          <div className="w-full sm:w-1/3 px-2">
            <label
              htmlFor="baths"
              className="block text-gray-700 font-bold mb-2"
            >
              Baths
            </label>
            <input
              type="number"
              id="baths"
              name="baths"
              className="border rounded w-full py-2 px-3"
              required=""
              value={fields.baths}
              min={1}
              {...register("baths", {
                required: "This field is required",
                onChange: (e) => {
                  handleChange(e);
                },
              })}
            />
            {errors.baths?.message && (
              <span className="text-red-500 text-sm font-bold">
                {errors.baths?.message}
              </span>
            )}
          </div>
          <div className="w-full sm:w-1/3 pl-2">
            <label
              htmlFor="square_feet"
              className="block text-gray-700 font-bold mb-2"
            >
              Square Feet
            </label>
            <input
              type="number"
              id="square_feet"
              name="square_feet"
              className="border rounded w-full py-2 px-3"
              required=""
              value={fields.square_feet}
              min={20}
              {...register("square_feet", {
                required: true,
                min: 20,
                onChange: (e) => {
                  handleChange(e);
                },
              })}
            />
            {errors.square_feet && (
              <span className="text-red-500 text-sm font-bold">
                {errors.square_feet.type === "min" &&
                  "Square feet must be at least 20 square feet"}
                {errors.square_feet.type === "required" &&
                  "This field is required"}
              </span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div>
              <input
                type="checkbox"
                id="amenity_wifi"
                name="amenities"
                defaultValue="Wifi"
                className="mr-2"
                checked={fields?.amenities?.includes("Wifi")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_wifi">Wifi</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_kitchen"
                name="amenities"
                defaultValue="Full Kitchen"
                className="mr-2"
                checked={fields?.amenities?.includes("Full Kitchen")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_kitchen">Full kitchen</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_washer_dryer"
                name="amenities"
                defaultValue="Washer & Dryer"
                className="mr-2"
                checked={fields?.amenities?.includes("Washer & Dryer")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_washer_dryer">Washer &amp; Dryer</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_free_parking"
                name="amenities"
                defaultValue="Free Parking"
                className="mr-2"
                checked={fields?.amenities?.includes("Free Parking")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_free_parking">Free Parking</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_pool"
                name="amenities"
                defaultValue="Swimming Pool"
                className="mr-2"
                checked={fields?.amenities?.includes("Swimming Pool")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_pool">Swimming Pool</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_hot_tub"
                name="amenities"
                defaultValue="Hot Tub"
                className="mr-2"
                checked={fields?.amenities?.includes("Hot Tub")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_hot_tub">Hot Tub</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_24_7_security"
                name="amenities"
                defaultValue="24/7 Security"
                className="mr-2"
                checked={fields?.amenities?.includes("24/7 Security")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_24_7_security">24/7 Security</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_wheelchair_accessible"
                name="amenities"
                defaultValue="Wheelchair Accessible"
                className="mr-2"
                checked={fields?.amenities?.includes("Wheelchair Accessible")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_wheelchair_accessible">
                Wheelchair Accessible
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_elevator_access"
                name="amenities"
                defaultValue="Elevator Access"
                className="mr-2"
                checked={fields?.amenities?.includes("Elevator Access")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_elevator_access">Elevator Access</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_dishwasher"
                name="amenities"
                defaultValue="Dishwasher"
                className="mr-2"
                checked={fields?.amenities?.includes("Dishwasher")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_dishwasher">Dishwasher</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_gym_fitness_center"
                name="amenities"
                defaultValue="Gym/Fitness Center"
                className="mr-2"
                checked={fields?.amenities?.includes("Gym/Fitness Center")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_gym_fitness_center">
                Gym/Fitness Center
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_air_conditioning"
                name="amenities"
                defaultValue="Air Conditioning"
                className="mr-2"
                checked={fields?.amenities?.includes("Air Conditioning")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_air_conditioning">Air Conditioning</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_balcony_patio"
                name="amenities"
                defaultValue="Balcony/Patio"
                className="mr-2"
                checked={fields?.amenities?.includes("Balcony/Patio")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_balcony_patio">Balcony/Patio</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_smart_tv"
                name="amenities"
                defaultValue="Smart TV"
                className="mr-2"
                checked={fields?.amenities?.includes("Smart TV")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_smart_tv">Smart TV</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="amenity_coffee_maker"
                name="amenities"
                value="Coffee Maker"
                className="mr-2"
                checked={fields?.amenities?.includes("Coffee Maker")}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                  onChange: (e) => {
                    handleAmenitiesChange(e);
                  },
                })}
              />
              <label htmlFor="amenity_coffee_maker">Coffee Maker</label>
            </div>
          </div>
          {errors.amenities && (
            <span className="text-red-500 text-sm font-bold">
              {errors.amenities.message}
            </span>
          )}
        </div>
        <div className="mb-4 bg-blue-50 p-4">
          <label className="block text-gray-700 font-bold mb-2">
            Rates (Leave blank if not applicable)
          </label>
          {/* <div className="mb-4 flex flex-wrap">
          <div className="w-full sm:w-1/3 pr-2"> */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col">
              <label htmlFor="weekly_rate" className="mr-2">
                Weekly
              </label>
              <input
                type="number"
                id="weekly_rate"
                name="rates.weekly"
                className="border rounded w-full py-2 px-3"
                value={fields?.rates?.weekly}
                min={120}
                {...register("rates.weekly", {
                  min: 120,
                  onChange: (e) => {
                    handleChange(e);
                  },
                })}
              />
              {errors?.rates?.weekly && (
                <span className="text-red-500 text-sm font-bold">
                  {errors?.rates?.weekly.type === "min" &&
                    "Weekly price must be at least $120"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="monthly_rate" className="mr-2">
                Monthly
              </label>
              <input
                type="number"
                id="monthly_rate"
                name="rates.monthly"
                className="border rounded w-full py-2 px-3"
                value={fields?.rates?.monthly}
                min={450}
                {...register("rates.monthly", {
                  min: 450,
                  onChange: (e) => {
                    handleChange(e);
                  },
                })}
              />
              {errors?.rates?.monthly && (
                <span className="text-red-500 text-sm font-bold">
                  {errors?.rates?.monthly.type === "min" &&
                    "Monthly price must be at least $450"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="nightly_rate" className="mr-2">
                Nightly
              </label>
              <input
                type="number"
                id="nightly_rate"
                name="rates.nightly"
                className="border rounded w-full py-2 px-3"
                value={fields?.rates?.nightly}
                min={20}
                {...register("rates.nightly", {
                  min: 20,
                  onChange: (e) => {
                    handleChange(e);
                  },
                })}
              />
              {errors?.rates?.nightly && (
                <span className="text-red-500 text-sm font-bold">
                  {errors?.rates?.nightly.type === "min" &&
                    "Nightly price must be at least $20"}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_name"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Name
          </label>
          <input
            type="text"
            id="seller_name"
            name="seller_info.name"
            className="border rounded w-full py-2 px-3"
            placeholder="Name"
            value={fields?.seller_info?.name}
            {...register("seller_info.name", {
              required: "This field is required",
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.seller_info?.name && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.seller_info?.name?.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_email"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Email
          </label>
          <input
            type="email"
            id="seller_email"
            name="seller_info.email"
            className="border rounded w-full py-2 px-3"
            placeholder="Email address"
            required=""
            value={fields?.seller_info?.email}
            {...register("seller_info.email", {
              required: true,
              pattern:
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.seller_info?.email && (
            <span className="text-red-500 text-sm font-bold">
              {errors.seller_info?.email?.type === "required" &&
                "This field is required"}
              {errors.seller_info?.email?.type === "pattern" &&
                "Invalid email address"}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="seller_phone"
            className="block text-gray-700 font-bold mb-2"
          >
            Seller Phone
          </label>
          <input
            type="tel"
            id="seller_phone"
            name="seller_info.phone"
            className="border rounded w-full py-2 px-3"
            placeholder="Phone"
            value={fields?.seller_info?.phone}
            {...register("seller_info.phone", {
              required: true,
              pattern: /^01[0125][0-9]{8}$/,
              onChange: (e) => {
                handleChange(e);
              },
            })}
          />
          {errors?.seller_info?.phone && (
            <span className="text-red-500 text-sm font-bold">
              {errors?.seller_info?.phone.type === "required" &&
                "This field is required"}
              {errors?.seller_info?.phone?.type === "pattern" &&
                "Invalid phone number"}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="images"
            className="block text-gray-700 font-bold mb-2"
          >
            Images (Select up to 4 images)
          </label>{" "}
          <div className="border rounded p-4 flex flex-col gap-4">
            {fields?.images && (
              <div className="grid grid-cols-6 gap-4">
                {fields?.images?.map((url) => (
                  <div className="relative group">
                    <img src={url} className="min-h-full object-cover" />
                    <button
                      onClick={(event) => handleDelete(event, url)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              name="images"
              id="images"
              required
              className="w-full text-gray-700 font-normal"
              {...register("images", {
                validate: (images) => {
                  const totalLength =
                    images.length + (fields?.images?.length || 0);

                  if (totalLength === 0) {
                    return "At least one image should be added";
                  }

                  // if (totalLength > 4) {
                  //   return "Total number of images can not be more than 4";
                  // }

                  return true;
                },
                onChange: (e) => {
                  handleImageChange(e);
                },
              })}
            />
          </div>
          {errors.images && (
            <span className="text-red-500 text-sm font-bold">
              {errors.images.message}
            </span>
          )}
        </div>{" "}
        <div>
          <button
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {isSubmitting ? "Loading..." : "Add Property"}
          </button>
        </div>
      </form>
    )
  );
};

export default PropertyAddForm;
