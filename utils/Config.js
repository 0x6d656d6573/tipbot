const yaml   = require('config-yaml')
const config = yaml(`${__dirname}/../config/default.yml`)

exports.get = function (key) {
    return key.split('.').reduce((o, i) => o[i], config)
}