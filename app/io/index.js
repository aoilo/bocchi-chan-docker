console.log("start");
const Eris = require("eris");
const time = require("../service/fDatetime")
// const sequelize = require("./service/database")
// const UserStatus = require("./models/UserStatus")
require('dotenv').config();
var bot = new Eris(process.env.TOKEN);

bot.on("error", (err) => {
    if (err.code === 1006) return;
});

bot.on("ready", () => {
    console.log("Ready");
    // sequelize.authenticate()
    // .then(()       => { console.log('Success test connection');        })
    // .catch((error) => { console.log('Failure test connection', error); });
});

bot.on("voiceChannelJoin", async (member, newChannel) => {
  // if(newChannel.guild.id === )
  console.log(newChannel.guild.id, newChannel.guild.name )
  if(newChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + newChannel.name + " に入室しました。");
    // try {
    //   let newStatus = await UserStatus.create({
    //     user_id: member.id,
    //     name: member.username,
    //     guild_id: member.guild.id,
    //     io: 1
    //   });
    // } catch(ex) {
    //   console.log(ex);
    // }
  } else if(newChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + newChannel.name + " に入室しました。");
  }

});

bot.on("voiceChannelLeave", async (member, oldChannel) => {
  console.log(oldChannel.guild.id, oldChannel.guild.name )
  if(oldChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username)  + " が " + oldChannel.name + " から退出しました。");
    // try {
    //   let newStatus = await UserStatus.create({
    //     user_id: member.id,
    //     name: member.username,
    //     guild_id: member.guild.id,
    //     io: 0
    //   });
    // } catch(ex) {
    //   console.log(ex);
    // }
  } else if(oldChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username)  + " が " + oldChannel.name + " から退出しました。");
  }
});

bot.on("voiceChannelSwitch", async (member, newChannel, oldChannel) => {
  console.log(newChannel.guild.id, newChannel.guild.name )
  if(newChannel.guild.id === process.env.GUILD_ID) {
    bot.createMessage(process.env.CHANNEL1, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から " + newChannel.name + " に移動しました。");
    // try {
    //   let newStatus = await UserStatus.create({
    //     user_id: member.id,
    //     name: member.username,
    //     guild_id: member.guild.id,
    //     io: 3
    //   });
    // } catch(ex) {
    //   console.log(ex);
    // }
  } else if(newChannel.guild.id === process.env.GUILD_ID2) {
    bot.createMessage(process.env.CHANNEL2, time.formatTime() + " に " + (member.nick ? member.nick : member.username) + " が " + oldChannel.name + " から " + newChannel.name + " に移動しました。");
  }
});


bot.connect();