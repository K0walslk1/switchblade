const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Betflip extends Command {
  constructor (client) {
    super(client, {
      name: 'betflip',
      aliases: ['bf'],
      category: 'games',
      parameters: [{
        type: 'number', min: 1, missingError: 'commands:betflip.noBetValue'
      }, {
        type: 'string', full: true, whitelist: ['heads', 'tails'], missingError: 'commands:betflip.noCoin'
      }]
    })
  }

  async run ({ channel, author, t }, bet, side) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      const { won, chosenSide } = await this.client.modules.economy.betflip(author.id, bet, side)
      embed.setImage(`https://raw.githubusercontent.com/bolsomito/koi/master/bin/assets/${chosenSide}.png`)
        .setDescription(t(`commands:betflip.${won ? 'victory' : 'loss'}`, { chosenSide, count: bet }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'NOT_ENOUGH_MONEY':
          embed.setTitle(t('errors:notEnoughMoney'))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
