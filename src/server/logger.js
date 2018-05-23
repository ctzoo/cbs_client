const winston = require('winston')

const myFormat = winston.format.printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const loggerConsole = winston.createLogger({
  format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.splat(), myFormat),
  transports: [new winston.transports.Console()],
})

let logger

const _l = (...loggers) => name => (level, msg, args) => {
  loggers.forEach(logger =>
    logger.log({
      level,
      label: name,
      message: msg,
      splat: args,
      timestamp: new Date().toString(),
    })
  )
}

if (process.env.NODE_ENV !== 'production') {
  // loggerConsole.transports[0].level = 'silly'
  // logger = _l(loggerConsole)

  // TODO: 临时
  loggerConsole.transports[0].level = 'info'

  const loggerFile = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), myFormat),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log', level: 'info' }),
    ],
  })

  logger = _l(loggerConsole, loggerFile)
} else {
  loggerConsole.transports[0].level = 'info'

  const loggerFile = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), myFormat),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log', level: 'info' }),
    ],
  })

  logger = _l(loggerConsole, loggerFile)
}

module.exports = function(name) {
  const l = logger(name)
  return {
    error: (msg, ...args) => l('error', msg, args),
    warn: (msg, ...args) => l('warn', msg, args),
    info: (msg, ...args) => l('info', msg, args),
    verbose: (msg, ...args) => l('verbose', msg, args),
    debug: (msg, ...args) => l('debug', msg, args),
    silly: (msg, ...args) => l('silly', msg, args),
  }
}
