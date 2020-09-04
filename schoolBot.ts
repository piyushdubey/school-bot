import { BOT_MESSAGES } from "./messages";
import { threadId } from "worker_threads";

interface EphemeralContext {
    greetings: boolean;
    bye: boolean;
    thanks: boolean;

    intent: string;

    item?: string;
    time?: number;
    type?: string;
}

interface BotContext {
    state: string;
    isActive: boolean;
    studentName: string;
    currentItem?: string;
    currentItemTime?: number;
    currentItemType?: string;
}

interface BotItem {
    item: string;
    itemTime: number;
    itemType: string;
}

interface BotSession {
    text?: string;
    voice?: ArrayBuffer;
    context: BotContext;
    queryExpenses(interval: any): Promise<BotItem[]>;
}

class BotLogic {
    private messages: string [] = [];
    private readonly states: { [name: string]: () => Promise<[string]> } = {
        //need to create general main for all methods to return to
        "main": async() => {
            this.say(BOT_MESSAGES["queryUser"].any());
            return[""] //TODO: redirect to intent of user response
        },

        "greeting": async() => {
            this.sayHi();
            return ["main"];
        },
        
        "bye": async() => {
            this.sayBye();
            return ["main"];
        },

        "priority_summary": async() => {
            this.say(BOT_MESSAGES["prioritySummaryLoading"].any());
            this.say(BOT_MESSAGES["prioritySummary"].any());
            //TODO: database query of top priorities by time and display in a pretty way
            return ["main"];
        },

        "priority_summary_type": async() => {
            this.say(BOT_MESSAGES["prioritySummaryLoading"].any());
            if (!this.context.currentItemType) {
                return ["specify_item_type"]
            }
            //TODO: database query of top priorities by type and display in pretty way
            //if no priorities BOT_MESSAGES.noPriority.any()
            return ["main"];
        },

        "item_time_logged": async() => {
            if(this.ephemeral.item && !this.context.currentItem) {
                this.context.currentItem = this.ephemeral.item;
            }

            if(this.ephemeral.time && !this.context.currentItemTime) {
                this.context.currentItemTime = this.ephemeral.time;
            } 

            if(!this.context.currentItem) {
                return ["specify_item"];//need to create this method
            }

            if(!this.context.currentItemTime) {
                return ["specify_item_log_time"];
            }
            //TODO: database write of the new log time
            this.say(BOT_MESSAGES["itemTimeLogged"].any(time: this.context.currentItemTime, item: this.context.currentItem));
        },

        "set_item_time": async () => {
            this.ephemeral.time = this.context.currentItemTime;
            if(!this.context.currentItemTime) {
                return ["specify_item_time"];
            }
        },
        "specify_item_log_time": async () => {
            this.say(BOT_MESSAGES["specifyItemLogTime"].any());
            //TODO : some sort of async function that gets the user's response message
            this.ephemeral.time = this.context.currentItemTime;
            return ["item_time_logged"];
        },

        "add_item": async () => {
            if(this.ephemeral.item && !this.context.currentItem) {
                this.context.currentItem = this.ephemeral.item;
            }

            if(this.ephemeral.time && !this.context.currentItemTime) {
                this.context.currentItemTime = this.ephemeral.time;
            } 

            if(this.ephemeral.type && !this.context.currentItemType) {
                this.context.currentItemType = this.ephemeral.type;
            }

            if(!this.context.currentItemTime) {
                return ["specify_item_time"];
            }

            if(!this.context.currentItemType) {
                return ["specify_item_type"];
            }

            //TODO : some code to add the new item to the database using BotItem interface defined line 24

            this.say(BOT_MESSAGES.addItem.any());

            return ["expense_added"];
        },

        "specify_item_time": async () => {
            this.say(BOT_MESSAGES["specifyItemTime"].any());
            //TODO : some sort of async function that gets the user's response message
            this.ephemeral.time = this.context.currentItemTime;
            if(this.ephemeral.intent == "set_item_time"){
                return ["set_item_time"];
            } else if (this.ephemeral.intent == "add_item"){
                return ["add_item"];
            }
        },

        "specify_item_type": async () => {
            this.say(BOT_MESSAGES["specifyItemType"].any());
            //TODO : some sort of async function that gets the user's response message
            this.ephemeral.type = this.context.currentItemType;
            if(this.ephemeral.intent == "add_item"){
                return ["add_item"];
            }
            else if(this.ephemeral.intent == "priority_summary_type"){
                return ["priority_summary_type"];
            }
        }
    }
    constructor(
        private wit: any, 
        private ephemeral: EphemeralContext,
        private context: BotContext,
        private session: BotSession,
    ) {
        //
    }

    private say(message: string) {
        this.messages.push(message);
    }

    private sayHi() { 
        //TODO: Once database implemented, can create personalized v generic greetings that use students name
        this.say(BOT_MESSAGES["greeting"].any());
    }

    private sayBye() {
        this.say(BOT_MESSAGES["bye"].any());
    }
}