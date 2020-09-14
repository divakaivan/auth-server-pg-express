const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authrorization = require("../middleware/authorization");

router.post("/register", validInfo, async (req, res) => {
  try {
    // get the user details
    const { name, email, password } = req.body;

    // check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length !== 0) {
      return res.status(401).send("User already exists");
    }

    // bcrypt the password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);

    const hashedPassword = await bcrypt.hash(password, salt);

    // enter the user in the db
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    // generate jwt token
    const token = jwtGenerator(newUser.rows[0].user_id);

    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error!");
  }
});

router.post("/login", validInfo, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Email or password is incorrect");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword)
      return res.status(401).json("Email or password is incorrect");

    const token = jwtGenerator(user.rows[0].user_id);
    res.json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error!");
  }
});

router.get("/is-verify", authrorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error!");
  }
});

module.exports = router;
