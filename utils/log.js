const chalk = require('chalk');

const print = (msg, type, color)=> console.log(chalk[color](`[${type.toLocaleUpperCase()}] %s`), msg);

exports.error = (msg)=> print(msg, 'error', 'redBright');
exports.warn = (msg)=> print(msg, 'warn', 'yellowBright');
exports.info = (msg)=> print(msg, 'info', 'cyanBright');
exports.success = (msg)=> print(msg, 'success', 'greenBright');