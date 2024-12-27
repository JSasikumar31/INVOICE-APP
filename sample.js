// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set up the server to listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.get('/send-invoice', async (req, res) => {
  try {
    await sendEmailWithAttachment();
    res.send('Invoice sent successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send invoice.');
  }
});

// The sendEmailWithAttachment function
async function sendEmailWithAttachment() {
  if (!process.env.Email_User || !process.env.Email_Password) {
    throw new Error("Please set Email_User and Email_Password in .env file.");
  }

  // Configure the email transport using SMTP server details
  let transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email provider
    auth: {
      user: process.env.Email_User,
      pass: process.env.Email_Password,
    }
  });

  // Path to the PDF in the Downloads folder
  const pdfPath = path.join(require('os').homedir(), 'Downloads', 'invoice.pdf');

  // Email options
  let mailOptions = {
    from: process.env.Email_User,
    to: 'sasijanapareddy31@gmail.com', // replace with recipient's email
    subject: 'Invoice from Robocoupler Pvt Ltd',
    text: 'Please find attached the invoice.',
    attachments: [
      {
        filename: 'invoice.pdf',
        path: pdfPath
      }
    ]
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
