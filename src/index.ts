import express from "express";

const app = express();
const PORT = process.env.PORT || 3100;

app.get("/", (req, res) => {
  res.send("Hello, Express TypeScript!");
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
