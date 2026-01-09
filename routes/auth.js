const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");

// Pages
router.get("/login", (_, res) => res.render("login"));
router.get("/register", (_, res) => res.render("register"));

// Register
router.post("/register", async (req, res) => {
  const { nom, adresse, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    nom,
    adresse,
    email,
    password: hash,
    image: req.file ? req.file.filename : null
  });

  res.redirect("/auth/login");
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.send("Utilisateur inexistant");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.send("Mot de passe incorrect");

  req.session.user = user;
  res.redirect("/dashboard");
});

// 🆕 Liste des utilisateurs (sécurisée)
router.get("/users", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");

  const users = await User.find();
  res.render("users", { users });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
});


module.exports = router;
