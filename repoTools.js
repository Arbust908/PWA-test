/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { spawn } = require('child_process');

const PACKAGES = ['front'];
const PACKAGE_GROUPS = {
    front: ['front'],
};
const getArgs = () => process.argv.slice(2, process.argv.length);

const checkOption = (...check) => {
    const args = getArgs();

    return check.includes(args[0]);
};

const checkSetupRan = async () => {
    try {
        await fsPromises.access(path.resolve(__dirname, 'node_modules'));

        return true;
    } catch (_) {
        return false;
    }
};

const runSetupScript = (script, args, cwd) =>
    new Promise((resolve, reject) => {
        const child = spawn(script, args, {
            cwd,
            shell: true,
            env: process.env,
            stdio: ['inherit', 'inherit', 'inherit'],
        });
        child.on('error', (error) => {
            console.error(error);
        });
        child.on('exit', (exitCode) => {
            if (exitCode !== 0) {
                reject();
            } else {
                resolve();
            }
        });
    });

const groupFilesByPackage = (filePaths) => {
    const parent = path.resolve(__dirname, '..');
    const packages = {};
    for (const filePath of filePaths) {
        let file = filePath;

        if (!path.isAbsolute(filePath)) {
            file = path.resolve(parent, filePath);
        }
        const relative = path.relative(parent, file);
        const pkg = relative.split(path.sep)[0];

        if (PACKAGES.includes(pkg)) {
            packages[pkg] = packages[pkg] || [];
            packages[pkg].push(file);
        }
    }

    return packages;
};

const installRepoTools = () => runSetupScript('yarn', null, './');

const run = async () => {
    const args = getArgs();
    const logFile = fs.createWriteStream('./repoTools_output', { flags: 'a' });
    logFile.write(`${new Date() + JSON.stringify(args)}\n`);

    if (args.length === 0 || args[0] === '-h' || args[0] === '--help') {
        process.stdout.write('Usage: node repoTools [OPTION]\n');
        process.stdout.write('The utility takes the following parameters\n\n');
        process.stdout.write('  -h,  help                           Prints this text message\n');
        process.stdout.write(
            '  -i,  install                        Installs all packages. Runs yarn for each package\n'
        );
        process.stdout.write('                                      Useful for bitbucket pipeline\n');
        process.stdout.write(
            '  -l,  lint                           Runs yarn lint in every package in the repository\n'
        );
        process.stdout.write('  -lf, lint-files [file paths]        Runs eslint on a list of provided files \n');
        process.stdout.write('  -pf, prettify-files [file paths]    Runs prettier on a list of provided files\n');

        process.stdout.write(
            '  -lint-ci                            Runs eslint files changed in this commit. Always exits with 0\n'
        );

        return;
    }

    if (checkOption('-s', 'setup')) {
        // eslint-disable-next-line no-return-await
        return await installRepoTools();
    }

    if (!(await checkSetupRan())) {
        process.stdout.write('repo-tools not installed, please run node sm -s first\n');

        return;
    }

    // eslint-disable-next-line global-require
    const { runScript } = require('./utils');

    if (checkOption('-lf', 'lint-files')) {
        const files = args.slice(1, args.length);
        const runLinterFor = groupFilesByPackage(files);
        const lintPromises = Object.entries(runLinterFor).map(async (entry) => {
            const [pkg, packageFiles] = entry;
            const targetFiles = packageFiles.filter((file) => ['.js', '.jsx', '.ts'].includes(path.extname(file)));

            if (targetFiles.length > 0) {
                await runScript('yarn', ['lint-files', '--fix', ...targetFiles], {
                    cwd: path.resolve(__dirname, '..', pkg),
                    logFile,
                });
            }
        });

        const results = await Promise.allSettled(lintPromises);
        for (const result of results) {
            if (result.status === 'rejected') {
                logFile.write(`${new Date()} Linter failed on files ${JSON.stringify(files)}\n`);
                // if any of the script fails signal node to exit with a non 0 exit code
                process.exitCode = 1;
            }
        }
    } else if (checkOption('-i', 'install')) {
        for (const pkg of PACKAGES) {
            try {
                await runScript('yarn', null, {
                    cwd: path.resolve(__dirname, '..', pkg),
                    logFile,
                });
            } catch (error) {
                process.exitCode = 1;
                logFile.write(
                    `${new Date()} - yarn install failed for ${pkg} packages. Check repoTools_output for details\n`
                );
            }
        }
    } else if (checkOption('-pf', 'prettify-files')) {
        const files = args.slice(1, args.length);

        console.log(files);

        try {
            await runScript('yarn', ['prettier-files', ...files], {
                cwd: __dirname,
                logFile,
            });
        } catch (error) {
            process.exitCode = 1;
            logFile.write(`${new Date()} - prettier failed. Check repoTools_output for details\n`);
        }
    } else if (checkOption('-lint-ci')) {
        const selectedPackage = PACKAGE_GROUPS[args[1]];
        const lintPromises = selectedPackage.map(async (pkg) => {
            await runScript('yarn', ['lint', '-f', 'json', '-o', 'eslint-output.json', '.'], {
                cwd: path.resolve(__dirname, '..', pkg),
                logFile,
            });
        });

        const results = await Promise.allSettled(lintPromises);
        for (const result of results) {
            if (result.status === 'rejected') {
                logFile.write(`${new Date()} Linter failed on files ${JSON.stringify(selectedPackage)}\n`);
            }
        }
    }
};

module.exports = run;
