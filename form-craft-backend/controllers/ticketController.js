const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendTicketEmail = async (req, res) => {
  try {
    const { reportedBy, summary, priority, link } = req.body;
    const bodyText = JSON.stringify({ reportedBy, summary, priority, link });

    await transporter.sendMail({
      from: `"Support Ticket" <${process.env.SMTP_USER}>`,
      subject: `Support Ticket: ${summary}`,
      text: bodyText,
    });

    return res.stats(200).json({ message: "Email sent to trigger flow." });
  } catch (error) {
    console.error("Ticket email error:", error);
    return res.status(500).json({ error: "Could not send email." });
  }
};
