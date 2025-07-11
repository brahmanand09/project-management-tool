const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });
