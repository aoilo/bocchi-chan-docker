console.log("start")

const Eris = require("eris")
const time = require("./app/service/fDatetime")
const sequelize = require("./app/service/database")
const UserStatus = require("./app/models/UserStatus")
const BoothItem = require("./app/models/BoothItem")
// const scrapeBoothData = require("./app/notifications/notification")
// const compareJsonFiles = require('./app/notifications/compareJson')
const lightScrap = require('./app/notifications/light_scrap')
// const jsonfile = require('jsonfile')
const path = require('path')
const fsp = require('fs').promises
const fs = require('fs')
const cron = require('node-cron')
// const tempPath = path.join(__dirname, "./app/temp");
require('dotenv').config()
var bot = new Eris(process.env.TOKEN)

bot.on("error", (err) => {
  if (err.code === 1006) return
})

bot.on("ready", () => {
  console.log("Ready")
  sequelize.authenticate()
    .then(() => { console.log('Success test connection'); })
    .catch((error) => { console.log('Failure test connection', error); })
})

bot.on("voiceChannelJoin", async (member, newChannel) => {
  // if(newChannel.guild.id === )
  console.log(newChannel.guild.id, newChannel.guild.name)
  if (newChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + newChannel.name + " に入室しました。");
    try {
      let newStatus = await UserStatus.create({
        user_id: member.id,
        name: member.username,
        guild_id: member.guild.id,
        io: 1
      });
    } catch (ex) {
      console.log(ex)
    }
  } else if (newChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + newChannel.name + " に入室しました。")
  }

})

bot.on("voiceChannelLeave", async (member, oldChannel) => {
  console.log(oldChannel.guild.id, oldChannel.guild.name)
  if (oldChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から退出しました。");
    try {
      let newStatus = await UserStatus.create({
        user_id: member.id,
        name: member.username,
        guild_id: member.guild.id,
        io: 0
      });
    } catch (ex) {
      console.log(ex)
    }
  } else if (oldChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から退出しました。")
  }
})

bot.on("voiceChannelSwitch", async (member, newChannel, oldChannel) => {
  console.log(newChannel.guild.id, newChannel.guild.name)
  if (newChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から " + newChannel.name + " に移動しました。")
    try {
      let newStatus = await UserStatus.create({
        user_id: member.id,
        name: member.username,
        guild_id: member.guild.id,
        io: 3
      })
    } catch (ex) {
      console.log(ex)
    }
  } else if (newChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から " + newChannel.name + " に移動しました。")
  }
});

bot.connect()


//command　＆　booth notify

const { EmbedBuilder, Client, Collection, GatewayIntentBits } = require('discord.js')
// const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('ready', async () => {
  console.log(`${client.user.tag}でログインしました。`)

  const channel = await client.channels.fetch(process.env.CHANNEL2)

  const main = async () => {
    try {
      const noChange = await lightScrap()
      if (!noChange) {
        const diffFile = path.join(__dirname, './app/temp/differences.json')
        let delta = await fsp.readFile(diffFile, 'utf8')
        delta = JSON.parse(delta)

        for (let item of delta) {
          const exist = await BoothItem.findOne({ where: { data_product_id: item['data_product_id'] } })
          if (exist) {
            continue
          }
          await BoothItem.create({
            data_product_id: item['data_product_id'],
            name: item['name'],
            shop_name: item['shop_name'],
            data_product_category: item['data_product_category'],
            url: item['url'],
            img: item['img'],
          });

          const newItemEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(item['name'])
            .setURL(item['url'])
            .setAuthor({ name: 'Booth新着アイテム' })
            .setDescription(item['shop_name'])
            .setImage(item['img'])
            .setTimestamp()
          channel.send({ embeds: [newItemEmbed] })
        }
      }
      console.log('0:不一致 1:一致 :', noChange)
    } catch (error) {
      console.error('Error:', error)
    }
  };

  // cron job
  cron.schedule('*/30 * * * * *', main)
})

client.login(process.env.TOKEN)

client.commands = new Collection()

const commandsPath = path.join(__dirname, './app/normal/commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file)
  const command = require(filePath)
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command)
  } else {
    console.log(`${filePath} に必要な "data" か "execute" がありません。`);
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`${interaction.commandName} が見つかりません。`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true })
  }
})