import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { getFields, getShape } from 'postgrest-js-tools';
import { attributeValueToString } from '../services/userService';
import supabase from '../supabase';
import type { definitions } from '../types/supabase';

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'A profile command'
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const { author } = message;

        // character include location
        type Character = definitions['characters'] & {
            location: definitions['locations'],
        };


        const characterShape = getShape<Character>()({
            id: true,
            exp: true,
            level: true,
            money: true,
            discord_id: true,
            location: {
                _: "location_id",
                name: true,
            },
        });

        const { body: characters } = await supabase
            .from<typeof characterShape>('characters')
            .select(getFields(characterShape))
            .eq('discord_id', author.id);

        if (characters?.[0] === null) {
            return message.reply('You have no character!');
        }

        const character = characters![0];

        type CharacterAttribute = definitions['character_attributes'] & {
            attribute: definitions['attributes'],
        };

        const characterAttributeShape = getShape<CharacterAttribute>()({
            id: true,
            value: true,
            character_id: true,
            attribute: {
                _: "attribute_id",
                name: true,
                is_percentage: true,
            }
        });

        const { body: characterAttributes } = await supabase
            .from<typeof characterAttributeShape>('character_attributes')
            .select(getFields(characterAttributeShape))
            .eq('character_id', character.id);


        const embed = new MessageEmbed()
            .setTitle(`${author.username}'s profile`)
            .setColor('#0099ff')
            .setThumbnail(`${author.avatarURL()}`);


        embed.addField('Level', `${character.level}`, true)
            .addField('Exp', `${character.exp} / 200`, true)
            .addField('Money', character.money!.toString(), true)
            .addField('Current location', character.location!.name!);


        let attributesValue = '';

        characterAttributes?.forEach((characterAttribute) => {
            attributesValue += `${characterAttribute.attribute.name}: ${attributeValueToString(characterAttribute.value, characterAttribute.attribute.is_percentage)}\n`;
        });

        embed.addField('Attributes', attributesValue);

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
