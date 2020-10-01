const { token, prefix } = require("./config.json")

const Discord = require("discord.js")
const client = new Discord.Client()

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on("message", async message => {
  let msg = message.content

  if (msg.startsWith(prefix)) {
    msg = msg.split(" ")

    if (msg[1] == undefined) {
      message.reply("Você precisa marcar alguem que esteja em um canal de voz")
    } else {
      let user = message.mentions.users.first().id
      
      const server = message.guild

      user = server.members.cache.find(u => u.id == user)

      let channel = user.voice.channel

      if (channel == null) {
        message.reply("A pessoa precisa estar em um canal de voz")
      } else {
        let oldChannel = channel
        let newChannel = await server.channels.create(`Earless ${user.user.username}`, {
          type: "voice",
          userLimit: 1
        })

        await newChannel.join().then(connection => {
          const dispatcher = connection.play("./song/rape1.mp3")

          dispatcher.on("finish", () => newChannel.leave())
        })
        await new Promise(r => setTimeout(_ => r(), (1000 * 2)))

        await user.voice.setChannel(newChannel)

        await new Promise(r => setTimeout(_ => r(), (1000 * 15)))

        await user.voice.setChannel(oldChannel)

        await newChannel.delete()
      }
    }
  }
})

client.login(token)