const express = require('express'); // importing express
const { HfInference } = require("@huggingface/inference"); // importing huggingface to use it
const app = express(); // making instence of express to use
const PORT = 5000;  // port no to run the server

// Use your API token here
const client = new HfInference(process.env.TOKEN);  // making instence of hugging,.. to use
// const client = new HfInference("token");

app.use(express.json()); // convverting response to json

app.get('/api/chat', async (req, res) => {
    const userMessage = req.query.message;  // Extract message from query parameter
    let out = ""; // Variable to accumulate response text
    let lastChunk = ""; // To store the last chunk of response

    // Check if the message query parameter is provided
    if (!userMessage) {
        return res.status(400).json({ error: "Message query parameter is required." });
    }

    try {
        // Call Hugging Face API to generate text with streaming
        const stream = client.textGenerationStream({
            model: "gpt2", // Model to use for text generation
            inputs: userMessage, // User's message as input for the model
            parameters: { max_new_tokens: 50 } // Limit response to 50 tokens
        });

        // Process each chunk of the stream
        for await (const chunk of stream) {
            if (chunk.generated_text) {
                // Only append the chunk if it's different from the last one
                if (chunk.generated_text !== lastChunk) {
                    out += chunk.generated_text; // Append new text to the final output
                    lastChunk = chunk.generated_text; // Update the last chunk
                    // it will ensure the response dont get copied and shown multiple time.
                }
            }
        }

        // Send the accumulated response text to the client
        res.json({ response: out }); // conslonig the result get forn the prompt of the user.
    } catch (error) {
        // Handle any errors that occur during the request processing
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
        // consoling the error 
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // starting the server.
});
