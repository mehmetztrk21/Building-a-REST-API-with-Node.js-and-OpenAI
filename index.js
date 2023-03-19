import dotenv from "dotenv";
import express from "express";
import {
    Configuration,
    OpenAIApi
} from "openai";
dotenv.config();
const app = express();
app.use(express.json());
app.use(async (req, res, next) => {
    console.log(process.env.OPEN_AI_KEY);
    next();
})
const Config = new Configuration({
    apiKey: process.env.OPEN_AI_KEY
});

function generatePrompt(question) {
    return `Answer the following question with as much detail as possible:${question}`;
}

const openai = new OpenAIApi(Config);
app.post("/find-complexity", async (req, res) => {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: generatePrompt(req.body.question),
            max_tokens: 2048,
            temperature: 0.6,
        }).then((response) => {
            console.log(response.data.choices[0].text);
            return response;
        }).catch((error) => {
            console.log(error.response.data);
        });
        return res.status(200).json({
            message: "Success",
            data: response.data.choices[0].text.replace(/(\r\n|\n|\r)/gm, "")
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }

});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});