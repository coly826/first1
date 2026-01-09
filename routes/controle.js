const express = require("express");
const router = express.Router();
const Controle = require("../models/Controle");

function protect(req, res, next) {
  if (!req.session.user) return res.redirect("/auth/login");
  next();
}

router.get("/dashboard", protect, async (req, res) => {
  const data = await Controle.find({ user: req.session.user.email });
  res.render("dashboard", { data });
});

router.get("/form", protect, (_, res) => res.render("form"));

router.post("/form", protect, async (req, res) => {
  await Controle.create({ ...req.body, user: req.session.user.email });
  res.redirect("/dashboard");
});

router.get("/delete/:id", protect, async (req, res) => {
  await Controle.findByIdAndDelete(req.params.id);
  res.redirect("/dashboard");
});

/* ✅ ROUTE RAPPORT (OBLIGATOIREMENT ICI) */
router.get("/rapport", protect, async (req, res) => {
  const data = await Controle.find();
  res.render("rapport", { data });
});


module.exports = router;
