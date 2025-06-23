import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { sql } from "./config/db.js";
import producRoutes from "./routes/product.route.js"
const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());  //helmet is a security midddleware that helps t protect app by setting various HTTP headers.
app.use(morgan("dev"));  //log the request
app.get("/api/products", producRoutes);

async function initDB() {
    try {
        await sql `
        CREATE TABLE IF NOT EXISTS products(
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        console.log("Database initialized successfully");
    } catch (error) {
        console.log("Error initDB", error);
    }
}

initDB().then(() => {
    app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
})
