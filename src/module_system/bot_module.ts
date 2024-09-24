import { EventHandlers } from "../deps.ts";
export interface ModuleInfo {
    name:string,
    description?:string,
    author?:string,
    handlers?:EventHandlers,
}
export class BotModule{
    public enable:boolean;
    public info:ModuleInfo | undefined;
    constructor(info:ModuleInfo){
        this.info = info;
        this.enable = false;
    }
    Disable(){
        this.enable = false;
        return this;
    }
    Enable(){
        this.enable = true;
        return this;
    }
}