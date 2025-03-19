const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Statische Dateien (HTML, CSS)

// E-Mail Konfiguration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: "sakinahafez02@gmail.com", // Deine Gmail-Adresse
    pass: "kwrm pggi gqzn irpg", // Hier dein App-Passwort eingeben
  },
});

// API-Route zum Senden der E-Mail
app.post("/send-email", async (req, res) => {
  console.log(req.body);
  const { name, email, telefon, adresse, dienstleistung, anliegen } = req.body;

  if (!name || !email || !telefon || !adresse) {
    return res.status(400).json({ error: "Alle Felder sind erforderlich." });
  }

  const mailOptions = {
    from: `Hausmeister Service <sakinahafez02@gmail.com>`,
    to: "sakinahafez02@gmail.com",
    subject: "Neue Hausmeister Anfrage",
    html: `
      <h3>Neue Anfrage über das Kontaktformular</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefonnummer:</strong> ${telefon}</p>
      <p><strong>Adresse:</strong> ${adresse}</p>
      <p><strong>Dienstleistung:</strong> ${dienstleistung || "Keine angegeben"}</p>
      <p><strong>Beschreibung:</strong> ${anliegen || "Keine angegeben"}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ E-Mail erfolgreich gesendet!");

    // **Weiterleitung zur Erfolg-Seite**
    res.redirect("/erfolg.html");
  } catch (error) {
    console.error("Fehlerdetails:", error);
    res.status(500).json({ error: `Fehler beim Senden der E-Mail: ${error.message}` });
  }
});


// Starte den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
