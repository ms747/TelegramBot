const Sequelize = require("sequelize");
const Telegraf = require("telegraf");
require('dotenv').config()
const TOKEN = process.env.TOKEN;

const path = "sqlite://database.sqlite";
const sequelize = new Sequelize(path, {
	operatorsAliases: false,
});

const bot = new Telegraf(TOKEN);
const Commands = require("./CommandsModel");

bot.help((ctx)=>{
  const list = [];
  list.push("Commands");
  list.push(`/addcommand command "description" "information" - Add New Command`);
  list.push("/commands - List add commands");
  list.push("/delete command - Delete command");
  ctx.reply(list.join('\n'));
})

bot.hears(/^\/addcommand (.+) "(.+)" "(.+)"$/, async ctx => {
	const command = ctx.match[1];
	const info = ctx.match[2];
	const description = ctx.match[3];
	const newCommand = Commands.build({ command, description, info });
	await newCommand.save();
});

bot.command("commands", async ctx => {
	let data;
	try {
		data = await Commands.findAll();
	} catch {
		console.log("Not Commands Found");
	}
	if (data.length > 0) {
		let list = [];
		list.push("Welcome To Gansan IT Technologies Pvt Ltd");
		data.forEach(d => {
			list.push(`/${d.command} - ${d.info}`);
		});
		ctx.reply(list.join("\n"));
	} else {
		ctx.reply("Not Commands Found");
	}
});

bot.hears(/^\/(\w+)$/, async ctx => {
	const inputCommand = ctx.match[1];
	const foundCommand = await Commands.findOne({
		where: { command: inputCommand },
	});

	if (foundCommand === null) {
		ctx.reply("Command Not Found");
	} else {
		const description = foundCommand.description.replace(/\\n/g, "\n");
		ctx.reply(description);
	}
});

bot.hears(/^\/delete (.+)$/, async ctx => {
	const inputCommand = ctx.match[1];
  const result = await Commands.destroy({ where: { command: inputCommand } });
  console.log(result)
});

bot.launch();
