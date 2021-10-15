/* eslint-disable @typescript-eslint/no-var-requires */
const execa = require('execa');
const replaceStream = require('replacestream');

const ansiRegex = ({ onlyFirst = false } = {}) => {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');

    return new RegExp(pattern, onlyFirst ? undefined : 'g');
};

const stripAnsiStream = () => replaceStream(ansiRegex(), '');

const runScript = async (command, args, options, buffer = false) => {
    try {
        const childProcess = execa(command, args, {
            cleanup: true,
            cwd: options.cwd,
            buffer,
            env: {
                ...process.env,
                FORCE_COLOR: 1,
            },
        });
        const { stdout, stderr } = childProcess;
        stdout.pipe(process.stdout, { end: false });
        stderr.pipe(process.stderr, { end: false });
        stdout.pipe(stripAnsiStream(), { end: false }).pipe(options.logFile, { end: false });
        stderr.pipe(stripAnsiStream(), { end: false }).pipe(options.logFile, { end: false });

        return await childProcess;
    } catch (error) {
        options.logFile.write(`${new Date()} - Error running ${command} - ${JSON.stringify(args)}`);
        throw error;
    }
};

module.exports = {
    runScript,
};
