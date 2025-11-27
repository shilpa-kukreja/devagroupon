import mongoose from "mongoose";

const businessRegistrationSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    businessType: { type: String, required: true },
    vatNumber: { type: String, required: true },
    chamberOfCommerce: { type: String },
    eoriNumber: { type: String },
    annualTurnover: { type: String },
    openingHours: { type: String },

    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    gender: { type: String },
    role: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    preferredLanguage: { type: String },
    street: { type: String, required: true },
    postalCode: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },

    hasForklift: { type: String },
    reachableByTruck: { type: String },
    hasTailLift: { type: String },
    needsTailLift: { type: String },
    password: {
   type: String,
  required: true, 
  
},


    // 🔹 New field
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


const BusinessRegistration =
  mongoose.models.BusinessRegistration ||
  mongoose.model("BusinessRegistration", businessRegistrationSchema);

export default BusinessRegistration;
