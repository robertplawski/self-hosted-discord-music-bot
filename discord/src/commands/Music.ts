import {
  ApplicationCommandOptionType,
  Attachment,
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  Guild,
  GuildMember,
  TextChannel,
  User,
} from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { doesFileExist, download, listFiles } from "../utils/Downloads.js"; // <- are you fucking kidding me
import { Pagination } from "@discordx/pagination";
import {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";

@Discord()
export class Music {
  @Slash({ description: "Play every song of an artist", name: "play-artist" })
  async playArtist(
    @SlashOption({
      name: "artist",
      description: "Name of the artist",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async (interaction: AutocompleteInteraction) => {
        const focused = interaction.options.getFocused();
        const files = await listFiles();

        // Extract unique artist names from files formatted "artist - song.ext"
        const artistsSet = new Set<string>();
        files.forEach((file) => {
          const splitIndex = file.indexOf(" - ");
          if (splitIndex > 0) {
            const artist = file.substring(0, splitIndex);
            if (artist.toLowerCase().startsWith(focused.toLowerCase())) {
              artistsSet.add(artist);
            }
          }
        });

        const choices = Array.from(artistsSet)
          .slice(0, 25)
          .map((artist) => ({ name: artist, value: artist }));

        await interaction.respond(choices);
      },
    })
    artist: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    const files = await listFiles();

    // Filter files starting with "artist - "
    const matchedSongs = files.filter((file) =>
      file.toLowerCase().startsWith(artist.toLowerCase() + " - ")
    );

    if (matchedSongs.length === 0) {
      await interaction.editReply(
        `❌ No songs found for artist: **${artist}**`
      );
      return;
    }

    // Here: implement your playback logic for matchedSongs list
    // For demo, just list them
    await interaction.editReply(
      `▶️ Playing all songs of **${artist}**:\n${matchedSongs
        .map((s) => `• ${s}`)
        .join("\n")}`
    );
  }
  @Slash({ description: "Play a song from the server", name: "play" })
  async play(
    @SlashOption({
      name: "song",
      description: "Choose a song to play",
      required: true,
      type: ApplicationCommandOptionType.String,
      autocomplete: async (interaction: AutocompleteInteraction) => {
        const focused = interaction.options.getFocused();
        const files = await listFiles();

        const filtered = files
          .filter((file) =>
            file.toLowerCase().startsWith(focused.toLowerCase())
          )
          .slice(0, 25)
          .map((file) => ({ name: file, value: file }));

        await interaction.respond(filtered);
      },
    })
    song: string,
    interaction: CommandInteraction
  ) {
    await interaction.deferReply();

    if (!(await doesFileExist(song))) {
      await interaction.editReply(`❌ The song "${song}" does not exist.`);
      return;
    }

    // Your playback logic here
    await interaction.editReply(`▶️ Playing song: **${song}**`);

    const getVoiceChannel = async (member: User, guild: Guild) => {
      const voiceChannel = await guild.voiceStates.fetch(member.id);
      return voiceChannel;
    };

    const guild = interaction.guild!;

    const voiceChannel = await getVoiceChannel(interaction.user, guild);

    const connection = await joinVoiceChannel({
      channelId: voiceChannel.channelId!,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const audioPlayer = createAudioPlayer();
    const resource = createAudioResource("./downloaded/" + song);
    audioPlayer.play(resource);
    const subscription = connection.subscribe(audioPlayer);
    if (subscription) {
      setTimeout(() => subscription.unsubscribe, 5_000);
    }
  }

  @Slash({ description: "Uploads a song to music server", name: "upload" })
  async upload(
    @SlashOption({
      name: "song",
      description: "Song attachement",
      required: true,
      type: ApplicationCommandOptionType.Attachment,
    })
    song: Attachment,
    @SlashOption({
      name: "overwrite",
      description:
        "Lets you decide whether or not overwrite a file that already exists ",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    overwrite: boolean,
    interaction: CommandInteraction
  ) {
    await interaction.reply("Acknowledged...");

    if (!song.contentType?.startsWith("audio")) {
      await interaction.editReply(
        "Invalid content type! Try sending an audio file"
      );
      return;
    }
    if ((await doesFileExist(song.name)) && !overwrite) {
      await interaction.editReply(
        "File is already present! Try sending another file or use argument overwrite"
      );
      return;
    }
    await interaction.editReply("Downloading...");
    await download(song.url, song.name);
    await interaction.editReply(`Downloaded ${song.name}...`);
  }

  @Slash({ description: "Lists all available song files", name: "list" })
  async list(interaction: CommandInteraction): Promise<void> {
    const files = await listFiles();

    if (files.length === 0) {
      await interaction.reply("No files found.");
      return;
    }

    const chunkSize = 10;
    const pages = [];

    for (let i = 0; i < files.length; i += chunkSize) {
      const chunk = files.slice(i, i + chunkSize);
      const embed = new EmbedBuilder()
        .setTitle("🎵 Available Songs")
        .setDescription(
          chunk.map((f, idx) => `**${i + idx + 1}.** ${f}`).join("\n")
        )
        .setColor("Random");

      pages.push({ embeds: [embed] });
    }

    // Reply first to avoid interaction timeout
    await interaction.reply("📄 Loading paginated file list...");

    // Send pagination to the channel
    const pagination = new Pagination(
      interaction.channel! as TextChannel,
      pages,
      {
        enableExit: true,
        time: 60_000,
      }
    );

    await pagination.send();
  }
}
