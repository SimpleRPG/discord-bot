import { ApplyOptions } from "@sapphire/decorators";
import {
    CommandErrorPayload,
    Listener,
    ListenerOptions,
    UserError,
} from "@sapphire/framework";

@ApplyOptions<ListenerOptions>({
    event: "commandError",
})
export class UserEvent extends Listener {
    public run(error: UserError, { message }: CommandErrorPayload) {
        return message.reply(error.message);
    }
}
