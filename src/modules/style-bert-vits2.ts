  import { logger } from "../logger.ts";
  import { DiscordBot } from "../main.ts";
  import { BotModule } from "../module_system/bot_module.ts";
  import { createEventHandlers } from "../deps.ts";
  /*
    require ffmpeg  to run this module.
  */
  interface StyleVertVits2Config {
    hostname: string;
    port: BigInt;
  }
  const config: StyleVertVits2Config = {
    hostname: "localhost",
    port: 5000n,
  };
  
  const cacheDir = "./cache";
  await Deno.mkdir(cacheDir, { recursive: true });
  const model_names:string[] = [
    // Edit here!!!!
    "model1",
    "model2"
  ]
  let current_model = model_names[0];
  export const StyleBertVITS2Module = new BotModule(
    {
        name: "tts_style_bert_vits2",
        handlers: createEventHandlers(
            {
              messageCreate(bot, message) {
                if(!message.guildId) return;
                if(message.isFromBot) return;
                if (message.content.startsWith("s!h")) {
                  bot.helpers.sendMessage(message.channelId,{
                    "content" : "s!j - 参加\ns!h - ヘルプ\ns!c [model_name] - モデル変更\ns!m - モデルリスト"
                  })
                }
                else if (message.content.startsWith("s!m")) {
                  bot.helpers.sendMessage(message.channelId,{
                    "content" : model_names.toString()
                  })
                }
                else if (message.content.startsWith("s!c")) {
                  current_model = message.content.split(" ")[1];
                  bot.helpers.sendMessage(message.channelId,{
                    "content" : `model changed:${current_model}`
                  })
                }
                else if (message.content.startsWith("s!j")) {
                  if (message.guildId) {
                    DiscordBot.instance.discord_client!.helpers.connectToVoiceChannel(
                      message.guildId,
                      message.channelId,
                    );
                  }
                } else {
                  (async () => {
                    const params = {
                      text: message.content,
                      model_name: current_model,
                      model_id: 0,
                      speaker_id: 0,
                      sdp_ratio: 0.2,
                      noise: 0.6,
                      noisew: 0.8,
                      length: 1,
                      language: "JP",
                      auto_split: true,
                      split_interval: 0.5,
                      assist_text_weight: 1,
                      style: "Neutral",
                      style_weight: 1,
                    };
        
                    // クエリパラメータをエンコードして生成する関数
                    const createQueryString = (params) => {
                      return Object.keys(params)
                        .map((key) =>
                          `${encodeURIComponent(key)}=${
                            encodeURIComponent(params[key])
                          }`
                        )
                        .join("&");
                    };
        
                    const url = `http://${config.hostname}:${config.port}/voice?${
                      createQueryString(params)
                    }`;
        
                    fetch(url)
                      .then((response) => {
                        if (!response.ok) {
                          throw new Error("Network response was not ok");
                        }
                        return response.blob();
                      })
                      .then(async (data) => {
                        const arrayBuffer = await data.arrayBuffer();
                        const wavData = new Uint8Array(arrayBuffer);
                        const wavFileName = `${crypto.randomUUID()}.wav`;
                        const wavFilePath = `${cacheDir}/${wavFileName}`;
        
                        // Save the WAV file
                        await Deno.writeFile(wavFilePath, wavData);
                        console.log(`WAVファイルが保存されました: ${wavFilePath}`);
                        // Convert WAV file using ffmpeg
                        const convertedFilePath = `${cacheDir}/${crypto.randomUUID()}.wav`;
                        const decoder = new TextDecoder();
        
                        const command = new Deno.Command("ffmpeg", {
                          args: [ "-i", wavFilePath, "-ac", "2", "-ar", "48000", convertedFilePath],
                        });
                        const { code, success, signal, stdout, stderr } = await command.output();
                        console.log(code); // => 0
                        console.log(success); // => true
                        console.log(signal); // => null
                        console.log(decoder.decode(stdout)); // => hello
                        console.log(decoder.decode(stderr)); // => hello from stderr
                        console.log(`Converted WAV file: ${convertedFilePath}`);
        
                        // Save the converted WAV file
                        const player = DiscordBot.instance.discord_client!.helpers.getPlayer(
                          BigInt(message.guildId!),
                        );
                        player.pushQuery(convertedFilePath);
        
                      })
                      .catch((error) => {
                        console.error("There was a problem with the fetch operation:", error);
                      });
                  })();
                }
              },
            },
          ),
    }
  );