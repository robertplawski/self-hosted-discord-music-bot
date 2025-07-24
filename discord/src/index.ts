import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import * as dotenv from "dotenv";
import { dirname, importx } from "@discordx/importer";

dotenv.config();

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    //IntentsBitField.Flags.GuildMembers,
  ],
  botGuilds: [process.env.GUILD_ID!],
  silent: false,
});

client.on("ready", async () => {
  console.log(">> Bot started");

  await client.initApplicationCommands();
});

client.on("interactionCreate", (interaction) => {
  client.executeInteraction(interaction);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  await client.login(process.env.BOT_TOKEN);
}

void run();
