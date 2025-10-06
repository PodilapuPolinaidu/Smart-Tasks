const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const db = require("../config/mysqlConnections");

const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.body.name;
    const folderpath = path.join(__dirname, "..", "uploads", username);
    if (!fs.existsSync(folderpath)) {
      fs.mkdirSync(folderpath, { recursive: true });
    }
    cb(null, folderpath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(" ").join(""));
  },
});
const upload = multer({ storage });
const secretkey = process.env.SECRET_KEY;

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0)
      return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password, profile_image) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, req.file ? req.file.filename : null]
    );

    res.json({
      msg: "User registered successfully",
      userId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM users");
    return res.status(200).json(results);
  } catch (err) {
    return res.status(400).json("Server error");
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (results.length === 0) {
    return res.status(401).json({ message: "User not found" });
  }

  const user = results[0];
  const status = await bcrypt.compare(password, user.password);

  if (status) {
    const token = jwt.sign({ id: user.id, email: user.email }, secretkey, {
      expiresIn: "3h",
    });

    const cookieOptions = {
      httpOnly: false,
      secure: false,
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    };

    res.cookie("token", token, cookieOptions);

    res.cookie("id", user.id, cookieOptions);
    res.cookie("Email", user.email, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
    });
  } else {
    console.log(res.status(401));
    res.status(401).json({ message: "Invalid Password" });
  }
});

module.exports = router;
