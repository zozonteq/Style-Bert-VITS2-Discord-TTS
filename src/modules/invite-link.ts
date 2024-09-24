import { BotModule } from "../module_system/bot_module.ts";
import { createEventHandlers} from "../deps.ts"
import { logger } from "../logger.ts";

export function generateDiscordInviteLink(application_id: bigint,permissions: bigint): string {
    return `https://discord.com/api/oauth2/authorize?client_id=${application_id}&permissions=${permissions}&scope=bot%20applications.commands`
}
export const inviteLinkModule = new BotModule(
  {
    name: "invite link",
    description: "このボットの招待リンクを作成します。",
    handlers:createEventHandlers({
      ready: (_,payload) => {
        logger.info(`🔗 ${generateDiscordInviteLink(payload.applicationId,8n)}`)
      }
    })
  }
)