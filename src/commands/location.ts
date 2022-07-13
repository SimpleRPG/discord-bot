import { ApplyOptions } from '@sapphire/decorators';
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import { Message, MessageEmbed } from 'discord.js';
import { getFields, getShape } from 'postgrest-js-tools';
import supabase from '../supabase';
import type { definitions } from '../types/supabase';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'A basic command',
	aliases: ['loc'],
	subCommands: [{ input: 'all', default: true }]
})
export class UserCommand extends SubCommandPluginCommand {
	public async all(message: Message) {
		const shape = getShape<definitions['locations']>()({
			name: true,
			level: true
		});

		let { data: locations } = await supabase.from<typeof shape>('locations').select(getFields(shape));

		const embed = new MessageEmbed()
			.setTitle('Locations')
			.setDescription(locations!.map((location) => `${location.name} - Lvl ${location.level}`).join('\n'));

		return message.channel.send({
			embeds: [embed]
		});
	}
}
