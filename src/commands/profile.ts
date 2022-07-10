import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { attributeValueToString } from '../services/userService';
import supabase from '../supabase';
import type { definitions } from '../types/supabase';

// character include location
type Character = definitions['characters'] & {
    location: definitions['locations'],
};

type CharacterAttribute = definitions['character_attributes'] & {
    attribute: definitions['attributes'],
};


@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'A profile command'
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const { author } = message;

        const { body: character } = await supabase
            .from<Character>('characters')
            .select('id,exp,level,money,discord_id,location:location_id(name)')
            .eq('discord_id', author.id)
            .single();

        if (character === null) {
            return message.reply('You have no character!');
        }

        const { body: characterAttributes } = await supabase
            .from<CharacterAttribute>('character_attributes')
            .select('id,value,character_id,attribute_id,attribute:attribute_id(name,is_percentage)')
            .eq('character_id', character.id)
            .order('attribute_id');


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
