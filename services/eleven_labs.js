const axios = require("axios");
const fs = require("node:fs");
const {join} = require("node:path");
const {pipeline} = require("node:stream/promises");
const {v4} = require("uuid");
const config = require("../cfg/config.json");
const {error} = require("node:console");

module.exports = {
  generateAudio: async (text) => {
    const data = {
      text: text,
      model_id: config.eleven_labs.model_id,
      voice_settings: config.eleven_labs.voice_settings,
    };

    const headers = {
      Accept: "audio/mpeg",
      "xi-api-key": process.env.EL_API_KEY,
      "Content-Type": "application/json",
    };

    const response = await axios
      .post(
        `https://api.elevenlabs.io/v1/text-to-speech/${config.eleven_labs.voice_id}/stream?optimize_streaming_latency=${config.eleven_labs.query_settings.optimize_streaming_latency}&output_format=${config.eleven_labs.query_settings.output_format}`,
        JSON.stringify(data),
        {headers: headers, responseType: "stream"},
      )
      .catch((error) => {
        throw error("Error on generating audio from Eleven Labs:", error);
      });

    if (!response.data) throw error("Error in Eleven Labs API call");

    const audio_id = v4();

    const path = join(".", "output", `${audio_id}.mp3`);

    const audio_path = await pipeline(response.data, fs.createWriteStream(path))
      .then(() => {
        console.log("Audio saved: " + path);
        return path;
      })
      .catch((err) => {
        throw error("Error in Pipeline while processing stream from Eleven Labs", err);
      });

    return audio_path;
  },
};
