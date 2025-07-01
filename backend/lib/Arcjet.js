import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";

// import dotenv from "dotenv";
import "dotenv/config";

// init arcjet
export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics:("ip.src"),
    rules: [
        shield({mode:"LIVE"}),   //shield protects app from common attacks such as SQL injection, XSS, CSRF attacks
        detectBot({
            mode:"LIVE",    //block all bots except search engines
            allow:[
                "CATEGORY:SEARCH_ENGINE"
            ]
        }),
        // rate limiting

        tokenBucket({
            mode: "LIVE",
            refillRate: 5,
            interval: 10,
            capacity: 10,
        }),
    ],
});

// token bucket algorithm
// slidingwindow