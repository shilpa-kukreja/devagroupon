import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        companyName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        subscribedAt: { type: Date, default: Date.now }
});
const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;