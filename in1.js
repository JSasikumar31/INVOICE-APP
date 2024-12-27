const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const os = require("os"); // For accessing home directory

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "invoice4.html"));
});

// Route to handle sending the invoice
app.get("/send-invoice", async (req, res) => {
  try {
    const username = os.userInfo().username; // Get the current user's username dynamically

    // Function to move the PDF from Downloads to Desktop
    function movePdfToDesktop(fileName) {
      const downloadsDir = path.join(os.homedir(), "Downloads");
      const desktopDir = path.join(os.homedir(), "Desktop");

      const sourcePath = path.join(downloadsDir, fileName);
      const destinationPath = path.join(desktopDir, fileName);

      // Check if the file exists in the Downloads folder
      if (!fs.existsSync(sourcePath)) {
        console.log(`File not found: ${fileName}`);
        return;
      }

      // Move the file
      fs.renameSync(sourcePath, destinationPath);
      console.log(`Successfully moved ${fileName} to Desktop.`);
    }

    await sendEmailWithAttachment(); // Send email with the invoice
    movePdfToDesktop("invoice.pdf"); // Move the PDF to Desktop

    res.send("Invoice sent successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to send invoice.");
  }
});

// Function to send email with attachment
async function sendEmailWithAttachment() {
  if (!process.env.Email_User || !process.env.Email_Password) {
    throw new Error("Please set Email_User and Email_Password in .env file.");
  }

  // Configure the email transport using SMTP server details
  let transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email provider if necessary
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Password,
    },
  });

  // Path to the PDF in the Downloads folder
  const pdfPath = path.join(os.homedir(), "Downloads", "invoice.pdf");

  // Email options
  let mailOptions = {
    from: process.env.Email_User,
    to: ["sasijanapareddy31@gmail.com", "robocoupler.course@gmail.com"], // Replace with recipient's emails
    subject: "Invoice from Robocoupler Pvt Ltd",
    text: "Please find attached the invoice.",
    attachments: [
      {
        filename: "invoice.pdf",
        path: pdfPath,
      },
    ],
  };

  // Send the email
  await transporter.sendMail(mailOptions);
  console.log("Invoice email sent successfully!");
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
