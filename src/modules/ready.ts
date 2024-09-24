import { BotModule } from "../module_system/bot_module.ts";
import { createEventHandlers} from "../deps.ts"
import { logger } from "../logger.ts";


export const readyMessageModule = new BotModule(
  {
    name: "Bot Info",
    description: "ボットについての情報を、起動時にお知らせします。",
    handlers:createEventHandlers({
      ready: (_,payload) => {
        logger.info(`🌟 ${payload.user.username}#${payload.user.discriminator} としてログインしました。`)
      }
    })
  }
)