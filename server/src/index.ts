import express, { Request, Response } from "express";
import config from "./config/config.js";
import routes from "./routes/index.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json()); // This will parse application/json

// api routes
app.get("/", (req, res, next) => {
    res.status(200).send(`server running on ${config.BASE_URL}`);
});

// api routes
app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})