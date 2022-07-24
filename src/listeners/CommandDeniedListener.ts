import { ApplyOptions } from "@sapphire/decorators";
import {
    CommandDeniedPayload,
    Listener,
    ListenerOptions,
    UserError,
} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
    event: "commandDenied",
})
export class UserEvent extends Listener {
    public run(error: UserError, { message }: CommandDeniedPayload) {
        return message.reply(error.message);
    }
}
