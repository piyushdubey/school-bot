import { BOT_MESSAGES } from "./messages";

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

export interface BotAddItemAction extends BotItem {
    type: "add_item";
}

export type BotAction = BotAddItemAction;

interface BotSession {
    text?: string;
    voice?: ArrayBuffer;
    context: BotContext;
    queryExpenses(interval: any): Promise<BotItem[]>;
}


function defaultContext(): BotContext {
    return{
        state: "init",
        isActive: true,
        studentName: "",
        currentItem: undefined,
        currentItemTime: undefined,
        currentItemType: undefined,
    };
}

class BotLogic {
    private messages: string [] = [];
    private actions: BotAction[] = [];
    private readonly states: { [name: string]: Array<[string, () => Promise<[string] | [string, string]>]> } = {
        "init": [
            ["greeting", async() => {
                this.sayHi();
                return ["main!"];
            }],
        ],

        "main": [
            ["add_item", async () => {
                this.context.currentItem = undefined;
                this.context.currentItemTime = undefined;
                this.context.currentItemType = undefined;
                return ["add_item!"];
            }],
        ],

        "add_item": [
            ["add_item", async () => {
                if(this.ephemeral.item && !this.context.currentItem) {
                    this.context.currentItem = this.ephemeral.item;
                }

                if(this.ephemeral.time && !this.context.currentItemTime) {
                    this.context.currentItemTime = this.ephemeral.time;
                } 

                if(this.ephemeral.type && !this.context.currentItemType) {
                    this.context.currentItemType = this.ephemeral.type;
                }

                // if(!this.context.currentExpenseItem) {
                //     return ["specify_expense_item!"];
                // }

                // if(!this.context.currentExpenseIncurredOn) {
                //     return ["specify_expense_moment!"];
                // }

                // if(!this.context.currentExpenseValue) {
                //     return ["specify_expense_value!"];
                // }

                this.action({
                    type: "add_item",
                    item: this.context.currentItem,
                    itemTime: this.context.currentItemTime,
                    itemType: this.context.currentItemType,
                });

                this.say(BOT_MESSAGES.addItem.any());

                return ["main", "expense_added"];
            }],
        ],
    }
    constructor(
        private wit: any, 
        private ephemeral: EphemeralContext,
        private context: BotContext,
        private session: BotSession,
    ) {
        //
    }

    private action(action: BotAction) {
        this.actions.push(action);
    }

    private say(message: string) {
        this.messages.push(message);
    }

    private sayHi() { 
        this.say(BOT_MESSAGES.greeting.any());
    }
}