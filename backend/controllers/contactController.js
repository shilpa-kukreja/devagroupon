import Contact from "../models/contactModels.js";




export const contactMessage = (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const contactMessage = new Contact({
      name,
      email,
        phone,
        subject,
        message
    });

    contactMessage.save()
      .then(() => {
        res.status(201).json({ message: "Contact message saved successfully." });
      })
      .catch((error) => {
        res.status(500).json({ error: "Failed to save contact message." });
      });

  } catch (error) {
    res.status(500).json({ error: "Server error." });
    res.error = error;
  }
}



// In your controller
export const getContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: messages.length,
      messages: messages
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error." 
    });
  }
}

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Contact.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ 
        success: false,
        error: "Contact message not found." 
      });
    }
    res.status(200).json({ 
      success: true,
      message: "Contact message deleted successfully." 
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ 
      success: false,
      error: "Server error." 
    });
  }
}