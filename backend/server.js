import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { sql } from "./config/db.js";
import {aj} from "./lib/Arcjet.js";
import productRoutes from "./routes/product.route.js"
import path from "path";
const app = express();

const PORT = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(helmet(
    {
        contentSecurityPolicy: false,
    }
));  //helmet is a security midddleware that helps t protect app by setting various HTTP headers.
app.use(morgan("dev"));  //log the request

// apply arcjet rate-limit to all routes
app.use(async (req,res,next) => {
    try {
        const decision = await aj.protect(req, {
            requested:1 //specifies that eavh request consumes 1 token
        })
        if(decision.isDenied()){
            if(decision.reason.iRateLimit()){
                res.status(429).json({error: "Too many requests"});
            }
            else if(decision.reason.isBot())
            {
                res.status(403).json({error: "Bot access is denied"});
            }
            else
            {
                res.status(403).json({error: "Forbidden"});
            }
            return
        }
        // check or spoofed bots
        
        next();
        if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())){
            res.status(403).json({error: "Spoofed bot detected"});
            return;
        }
    } catch (error) {
        console.log("Arcjet error",error);
        next(error);
    }
});

// routes
app.use("/api/products/", productRoutes);

// For deployment
const __dirname = path.resolve();

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.get(/.*/, (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    })
}

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
    app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
})
