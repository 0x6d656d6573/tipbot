const {Command} = require('discord-akairo')

class RoleCommand extends Command
{
    constructor()
    {
        super('role', {
            aliases  : ['role'],
            ownerOnly: true,
        })
    }

    async exec(message)
    {
        const role    = message.guild.roles.cache.find(role => role.id === '917325119603507240')
        const members = message.guild.members.cache.filter(member => !member.roles.cache.has(role.id))

        console.log(members.size) // REMOVE

        members.forEach(member => {
            if (!member.user.bot) {
                console.log(member.user.username) // REMOVE
                member.roles.add(role)
            }
        })
    }
}

module.exports = RoleCommand