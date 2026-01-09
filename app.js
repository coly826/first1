require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
  secret: "monsecret",
  resave: false,
  saveUninitialized: false
}));

// MongoDB
mongoose.connect("mongodb+srv://blindecoly:coly826@aplicationxy.kaumhiu.mongodb.net/projettwyford?retryWrites=true&w=majority&appName=aplicationxy")
  .then(() => console.log("✅ MongoDB connecté"))
  .catch(err => console.error("Erreur mongoose :", err));

// Redirection racine
app.get("/", (_, res) => res.redirect("/auth/login"));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/controle"));

// Serveur
app.listen(3000, () => {
  console.log("🚀 http://localhost:3000");
});






