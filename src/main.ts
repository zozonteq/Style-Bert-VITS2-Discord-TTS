import { AudioBot, Bot , load, enableAudioPlugin , createBot, Intents, startBot} from "./deps.ts";
import { logger } from "./logger.ts";
import { moduleManager } from "./modules.ts";

export class DiscordBot{
  public discord_client:AudioBot<Bot> | undefined;
  public static instance:DiscordBot
  constructor(){
    load({export: true}).then(() => {
      const token:string = Deno.env.get("token")!;
      this.discord_client = enableAudioPlugin(createBot({
        token: token,
        intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent | Intents.GuildVoiceStates | Intents.GuildEmojis | Intents.DirectMessages,
      }));
      DiscordBot.instance = this;
      this.LoadModule();
      startBot(this.discord_client!);
    }).catch((reason) => {
      logger.error(`Error occured while loading .env`)
    })
    
    return this;
  }
  public LoadModule(){
    // hook events
    Object.keys(this.discord_client!.events).forEach((method:string)=>{
      let origin = this.discord_client!.events[method];
      this.discord_client!.events[method] = function(...args){
        moduleManager.modules.forEach((module) =>{
          if(!module.enable) return;
          if(!module.info?.handlers) return;
          Object.keys(module.info.handlers).forEach((handler) => {
            if(handler == method){
              module.info.handlers[handler].apply(DiscordBot.instance.discord_client!.events,args);
            }
          })
        })
        origin.apply(DiscordBot.instance.discord_client!.events,args);
      };
    });
    logger.info("All Modules loaded");
    moduleManager.modules.forEach(module => {
      if(module.enable) 
        logger.info(`✅ Activated  : ${module.info!.name}`)
      else
        logger.info(`❌ Deactivated: ${module.info!.name}`)
    })
  }

}

await new DiscordBot();