/**
 * Get private key
 *
 * @return {*}
 * @param message
 * @param data
 */
exports.error = function (message, data) {
    console.log(data)

    const log = require('simple-node-logger').createRollingFileLogger({
        errorEventName : 'error',
        logDirectory   : '../logs',
        fileNamePattern: 'tipbot-<DATE>.log',
        dateFormat     : 'YYYY.MM.DD'
    })

    log.info(data, new Date().toJSON())
}