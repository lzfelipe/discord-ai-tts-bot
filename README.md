# DISCORD AI BOT (ELEVEN LABS + OpenAI)

This is a Discord Bot that combines functionalities from Eleven Labs (TTS and Voice Cloning) and OpenAI API for text gen. With this you can locally host a discord bot that will hear your discord members conversation and (if set to) when triggered will answer with text generated directly from the GPT model and reproduce with any voice you have available in your Eleven Labs Voice Library.

This is heavily inspired in this repo, so please check it: [discord-speech-recognition](https://github.com/Rei-x/discord-speech-recognition)

## Requirements

To locally host this bot you'll need the following:

#### Dependencies

- git
- node.js (Tested on v18.16.0)
- ffmpeg - [Windows](https://ffmpeg.org/)

#### API Keys

- [OpenAI](https://platform.openai.com/docs/overview)
- [ElevenLabs](https://elevenlabs.io/)

*There's free trials for both of these for you to test!*

## Configuration

### .ENV

```dotenv
BOTTOKEN=Discord bot secret token
CLIENTID=Discord Bot Application ID
MAIN_CHANNEL_ID=Channel id for typing interaction display

# open-ai
API_KEY=Your api key to open AI
ORGANIZATION_ID=Your organization ID of open AI

# elevenlabs
EL_API_KEY=Eleven labs API Key

```

### config.json

```json
{
  "open_ai": {
    "model_name": "gpt-4-1106-preview", //Open ai model name to generate responses, see https://platform.openai.com/docs/models/continuous-model-upgrades for more info
    "ai_personality": "You're a helpful assistant", //Initial prompt for the conversation, this will define how your openAI will generate your responses
    "max_context_lenght": 10 //maximum messages that will get attached to OpenAI request, leaving a higher number will consume more tokens and greatly increase costs but the AI will get a better context memory
  },
  "eleven_labs": {
    //see https://elevenlabs.io/docs/api-reference/streaming for information about this section
    "model_id": "eleven_multilingual_v2",
    "voice_id": "bHsbq7uvmLfNYTK2aEcL",
    "voice_settings": {
      "stability": 0.45,
      "similarity_boost": 0.7,
      "style": 0.15,
      "use_speaker_boost": true
    },
    "query_settings": {
      "optimize_streaming_latency": "3",
      "output_format": "mp3_44100_64"
    }
  },
  "discord_bot": {
    "use_triggers": true, //if set to false bot will respond to whatever someone speaks
    "trigger_words": ["phrase or word that your bot has to detect to start generating a response"],
    "join_phrase": "phrase or word to the bot join your current channel",
    "target_language": "en-US", //target language for speach recognition
    "censor_profanity": false //if set to true this will censor messages received from discord speakers
  }
}
```

## How to run

After you are done with configurations just simply:

```
$ npm install
```

and...

```
$ node index.js
```

you should see something like this:
