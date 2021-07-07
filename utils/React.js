/**
 * Success
 *
 * @param command
 * @param message
 * @param title
 * @param description
 * @return {Promise<void>}
 */
exports.success = async function (command, message, title = null, description = null) {
    await message.react('✅')
    await this.done(message)

    if (title !== null) {
        const embed = command.client.util.embed()
            .setColor('#1DB151')
            .setTitle(title)

        if (description !== null) {
            embed.setDescription(description)
        }

        await message.author.send(embed)
    }
}

/**
 * Error
 *
 * @param command
 * @param message
 * @param title
 * @param description
 * @return {Promise<void>}
 */
exports.error = async function (command, message, title = null, description = null) {
    await message.react('❌')
    await this.done(message)

    if (title !== null) {
        const embed = command.client.util.embed()
            .setColor('#FF0000')
            .setTitle(title)

        if (description !== null) {
            embed.setDescription(description)
        }

        await message.author.send(embed)
    }
}

/**
 * In progress
 *
 * @return {Promise<void>}
 */
exports.processing = async function (message) {
    await message.react('⌛')
}

/**
 * Done7e6ce569cc1d4e3c2bb19400e8bbedb6
 *
 * @return {Promise<void>}
 */
exports.done = async function (message) {
    const reaction = message.reactions.cache.get('⌛')

    try {
        await reaction.remove();
    } catch (error) {
        console.error('Failed to remove reaction')
    }
}

/**
 * Done
 *
 * @return {Promise<void>}
 */
exports.burn = async function (message) {
    await message.react('🔥')
    await message.react('💀')
    await this.done(message)
}

/**
 * Sea creature
 *
 * @param message
 * @param amount
 * @return {Promise<void>}
 */
exports.seaCreature = async function (message, amount) {
    // Characters: https://unicode-table.com/en/1F1FC/

    if (parseFloat(amount) <= 1) {
        await message.react('🦐')
    }
    if (parseFloat(amount) > 1 && parseFloat(amount) <= 10) {
        await message.react('🦀')
    }
    if (parseFloat(amount) > 10 && parseFloat(amount) <= 50) {
        await message.react('🐙')
    }
    if (parseFloat(amount) > 50 && parseFloat(amount) <= 100) {
        await message.react('🐟')
    }
    if (parseFloat(amount) > 100 && parseFloat(amount) <= 500) {
        await message.react('🐬')
    }
    if (parseFloat(amount) > 500 && parseFloat(amount) <= 1000) {
        await message.react('🦈')
    }
    if (parseFloat(amount) > 1000 && parseFloat(amount) <= 5000) {
        await message.react('🐳')
    }
    if (parseFloat(amount) > 5000) {
        await message.react('🐋')
    }
}