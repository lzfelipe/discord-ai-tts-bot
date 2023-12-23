const {OpenAI} = require("openai");
const config = require("../cfg/config.json");

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  apiKey: process.env.API_KEY,
});

module.exports = {
  generateResponse: async (messages) => {
    const completion = await openai.chat.completions.create({
      messages: messages,
      model: config.open_ai.model_name,
    });

    const textGenerated = completion?.choices[0]?.message?.content;

    if (!textGenerated) return "";

    return textGenerated;
  },
};
