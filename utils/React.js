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

    if (amount <= 1) {
        await message.react('🦐')
    }
    if (amount > 1 && amount <= 10) {
        await message.react('🦀')
    }
    if (amount > 10 && amount <= 50) {
        await message.react('🐙')
    }
    if (amount > 50 && amount <= 100) {
        await message.react('🐟')
    }
    if (amount > 100 && amount <= 500) {
        await message.react('🐬')
    }
    if (amount > 500 && amount <= 1000) {
        await message.react('🦈')
    }
    if (amount > 1000 && amount <= 5000) {
        await message.react('🐳')
    }
    if (amount > 5000) {
        await message.react('🐋')
    }
}