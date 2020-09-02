import * as yaml from "yaml";

const RAW_MESSAGES = yaml.parse(`

    greeting:
        - Hi there! What do you want to work on today?

    bye:
        - Good work '{{name}}', until next time! 👋😃

    prioritySummary:
        - Your upcoming items are: 

    prioritySummaryByType:
        - Here are your upcoming '{{itemType}}':
    
    noPriority:
        - You have no upcoming items. Sweet! 
    
    addItem:
        - Sounds good! I'll add that to the priority list. 

    specifyItemType:
        - Is that task a project, lecture, or test?

    specifyItemLogTime:
        - How long did you work on that task?

    specifyItemTime:
        -How long do you need to work on this task?

    itemTimeLogged:
        -Nice job! I logged '{{time}}' for the '{{item}}'
    
    itemTimeSet:
        -Sounds good! You now have '{{time}}' to work on '{{item}}'. Let's get to work!
    
    queryItemTime:
        - You still need to work on '{{item}}' for '{{time}}'

    queryUser:
        - Do you want to work on anything else?

`)

type KeyValueMap = { [key: string]: string };

class MessageCollection {
    constructor(private messages: string[]) {

    }

    get length() {
        return this.messages.length;
    }

    format(text: string, values: KeyValueMap) {
        return text.replace(/{{([a-zA-Z0-9\s]+)}}/g, (matched) => {
            return values[matched.replace(/[{}\s]/g, "")] || "";
        });
    }

    any(placeholders: KeyValueMap = {}) {
        return this.format(this.messages[Math.floor(Math.random() * this.messages.length)], placeholders);
    }

    get(i: number, otherwise: string = "", placeholders: KeyValueMap = {}) {
        return this.format(this.messages[i] || otherwise, placeholders);
    }
}

export const BOT_MESSAGES: { [key: string]: MessageCollection } = {};

for(const [key, messages] of Object.entries(RAW_MESSAGES)) {
    BOT_MESSAGES[key] = new MessageCollection(messages as string[]);
}