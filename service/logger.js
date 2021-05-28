const log = (...args) => {
    if (args[0] instanceof Error) {
        console.log('[rest-service]', args[0]);
    } else {
        console.log('[rest-service]', args.join(' '));
    }

}
module.exports = log;