// MODULES
require("dotenv").config();
const {Client, GatewayIntentBits, Events} = require("discord.js");
const {createAudioResource, createAudioPlayer, joinVoiceChannel, AudioPlayerStatus} = require("@discordjs/voice");
const {join} = require("node:path");
const {addSpeechEvent, SpeechEvents} = require("discord-speech-recognition");

const config = require("./cfg/config.json");
const open_ai = require("./services/open_ai");
const eleven_labs = require("./services/eleven_labs");
const utils = require("./utils/utils");

let messages = [
  {
    role: "system",
    content: config.open_ai.ai_personality,
  },
];

const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

addSpeechEvent(client, {lang: config.discord_bot.target_language, profanityFilter: config.discord_bot.censor_profanity});
const player = createAudioPlayer();

var available = true;

client.on(Events.MessageCreate, (msg) => {
  const voiceChannel = msg.member?.voice.channel;

  if (voiceChannel && msg.content.toLocaleLowerCase() == config.discord_bot.join_phrase.toLocaleLowerCase()) {
    joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    }).subscribe(player);

    const joinAudio = createAudioResource(join(".", "audios", "join.mp3"));

    if (joinAudio) player.play(joinAudio);
  }
});

client.on(SpeechEvents.speech, async (msg) => {
  if (available === false) {
    console.log("Bot unavailable for a new generation, still processing the last one...\n");
    return;
  }

  // If bot didn't recognize speech, content will be empty
  if (!msg.content) return;

  console.log(`Heard: ${msg.author.username} - ${msg.content}\n`);
  if (config.discord_bot.use_triggers == true) {
    if (!config.discord_bot.trigger_words.some((v) => msg.content.toLocaleLowerCase().includes(v))) {
      console.log("No trigger detected");
      return;
    }
  }

  available = false;

  try {
    const channel = client.channels.cache.get(process.env.MAIN_CHANNEL_ID);

    if (messages.length > config.open_ai.max_context_lenght) {
      messages.splice(1);
      console.log("Maximum context reached. Removing messages history...\n");
    }

    messages.push({role: "user", content: msg.content});

    await channel.sendTyping();

    console.log("Generating response from OpenAI");
    const ai_response = await open_ai.generateResponse(messages);

    messages.push({role: "assistant", content: ai_response});
    console.log(`AI Response: ${ai_response}`);

    console.log("Starting audio generation process");
    const audio = await eleven_labs.generateAudio(ai_response);

    const resource = createAudioResource(audio);

    player.play(resource);
  } catch (error) {
    console.log(error);
  }
});

player.on(AudioPlayerStatus.Idle, async () => {
  await utils.deleteAllFilesInDir("./output").then(() => {
    console.log("Ready to reproduce.");
    available = true;
  });
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("Reproducing audio...");
});

client.on(Events.ClientReady, () => {
  console.log("Bot ready!");
});

client.login(process.env.BOTTOKEN);
