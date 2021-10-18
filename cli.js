const cli = require('./repoTools');

cli().catch((error) => {
    console.error('Error handler');
    console.error(error);
    process.exitCode = 1;
});
