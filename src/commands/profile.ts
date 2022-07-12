import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { getFields, getShape } from 'postgrest-js-tools';
import { attributeValueToString } from '../services/userService';
// import { getFields } from 'postgrest-js-tools';
// import { attributeValueToString } from '../services/userService';
import supabase from '../supabase';
import type { definitions } from '../types/supabase';

type TCharacterAttributes = definitions['character_attributes'] & {
    attribute: definitions['attributes'];
}

// character include location
type TCharacter = definitions['characters'] & {
    location: definitions['locations'];
    character_attributes: TCharacterAttributes | Array<TCharacterAttributes>;
};

const characterShape = getShape<TCharacter>()({
    "*": true,
    location: {
        _: "location_id",
        name: true,
    },
    character_attributes: {
        _: "character_attributes",
        "*": true,
        attribute: {
            _: "attribute_id",
            "*": true,
        }
    },
});

const characterFields = getFields(characterShape);

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'A profile command'
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const { author } = message;

        const { body: character } = await supabase
            .from<typeof characterShape>('characters')
            .select(characterFields)
            .eq('discord_id', author.id)
            .single();

        if (character === null) {
            return message.reply('You have no character!');
        }

        const characterAttributes = character.character_attributes as Array<TCharacterAttributes>;

        const embed = new MessageEmbed()
            .setTitle(`${author.username}'s profile`)
            .setColor('#0099ff')
            .setThumbnail(`${author.avatarURL()}`);


        embed.addField('Level', `${character.level}`, true)
            .addField('Exp', `${character.exp} / 200`, true)
            .addField('Money', character.money!.toString(), true)
            .addField('Current location', character.location!.name!);


        const attributesValue = characterAttributes.map((characterAttribute) => {
            return `${characterAttribute.attribute.name}: ${attributeValueToString(characterAttribute.value, characterAttribute.attribute.is_percentage)}`;
        }).join('\n');

        embed.addField('Attributes', attributesValue || '');

        embed.footer = {
            text: `Bot Latency ?ms. API Latency ?ms.`
        }

        const msg = await message.channel.send({
            embeds: [embed]
        });

        embed.footer = {
            text: `Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp
                }ms.`
        }

        return msg.edit({
            embeds: [embed],
        });
    }
}
