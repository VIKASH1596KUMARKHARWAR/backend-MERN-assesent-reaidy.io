const { OpenRouter } = require("@openrouter/sdk");

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});

module.exports = openrouter;
