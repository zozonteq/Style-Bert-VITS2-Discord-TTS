import { BotModuleManager } from "./module_system/bot_module_manager.ts";
import { inviteLinkModule } from "./modules/invite-link.ts";
import { readyMessageModule } from "./modules/ready.ts";
import { StyleBertVITS2Module } from "./modules/style-bert-vits2.ts";

export const moduleManager = new BotModuleManager(
    [
        readyMessageModule          .Enable(),
        inviteLinkModule            .Enable(),
        StyleBertVITS2Module        .Enable()
    ]
);