const express = require("express");
const app = express();
const cors = require("cors");

// middleware

app.use(express.json()); // allows for the usage of req.body
app.use(cors());

// routes
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
  console.log("SERVER STARTED ON http://localhost:5000");
});
