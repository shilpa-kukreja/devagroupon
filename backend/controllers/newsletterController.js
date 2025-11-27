import Newsletter from "../models/newsletterModels.js";



export const addsubscriber = async (req, res) => {
    try {
        const { firstName, lastName, companyName, email } = req.body;
        if (!firstName || !lastName || !companyName || !email) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ error: "This email is already subscribed." });
        }
        const newSubscriber = new Newsletter({
            firstName,
            lastName,
            companyName,
            email
        });

        await newSubscriber.save();
        res.status(201).json({ message: "Subscribed to newsletter successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
        res.error = error;
    }
        
    }

export const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.status(200).json(subscribers);
    } catch (error) {
        res.status(500).json({ error: "Server error." });
        res.error = error;
    }
}


export const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubscriber = await Newsletter.findByIdAndDelete(id);

        if (!deletedSubscriber) {
            return res.status(404).json({ error: "Subscriber not found." });
        }

        res.status(200).json({ message: "Subscriber deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
        res.error = error;
    }
}
