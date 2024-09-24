import { BotModuleManager } from "./module_system/bot_module_manager.ts";
import { inviteLinkModule } from "./modules/invite-link.ts";
import { readyMessageModule } from "./modules/ready.ts";

export const moduleManager = new BotModuleManager(
    [
        readyMessageModule          .Enable(),
        inviteLinkModule            .Enable()
    ]
);