if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-production-domain.com"
        : ["http://localhost:3001", "http://client:3001"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = require("./routes");
const port = process.env.PORT || 3000;

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
