import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { attributeValueToString, getAttributesWithValuesFromCharacter, getCharacterCurrentLocation } from '../services/userService';
import supabase from '../supabase';
import type { definitions } from '../types/supabase';

@ApplyOptions<SubCommandPluginCommandOptions>({
    description: 'A profile command'
})
export class UserCommand extends SubCommandPluginCommand {
    public async messageRun(message: Message) {
        const { author } = message;

        let { body: characters } = await supabase
            .from<definitions['characters']>('characters')
            .select()
            .eq('discord_id', author.id);

        if (characters?.[0] === null) {
            return message.reply('You have no character!');
        }

        const character: definitions['characters'] = characters![0];

        let attributeValues = await getAttributesWithValuesFromCharacter(character);
        let locationName = (await getCharacterCurrentLocation(character)).name;

        const embed = new MessageEmbed()
            .setTitle(`${author.username}'s profile`)
            .setColor('#0099ff')
            .setThumbnail(`${author.avatarURL()}`);


        embed.addField('Level', `${character.level}`, true)
            .addField('Exp', `${character.exp} / 200`, true)
            .addField('Money', character.money.toString(), true)
            .addField('Current location', locationName);

        embed.addField('Attributes', `
            HP: ${attributeValueToString(attributeValues.hp)}
            Strength: ${attributeValueToString(attributeValues.strength)}
            Defense: ${attributeValueToString(attributeValues.defense)}
            Critical Chance: ${attributeValueToString(attributeValues.criticalChance)}
            Critical Damage: ${attributeValueToString(attributeValues.criticalDamage)}
            Evade Chance: ${attributeValueToString(attributeValues.evadeChance)}
            Escape Chance: ${attributeValueToString(attributeValues.escapeChance)}
        `);

        return await message.channel.send({
            embeds: [embed]
        });
    }
}
