import { BotModule } from "./bot_module.ts";

export class BotModuleManager{
    public modules:BotModule[];
    constructor(modules:BotModule[]){
        this.modules = modules;
    }
}