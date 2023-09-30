const inquirer = require("inquirer");
const CoreUtils = require("./lib/utils");
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const { performance } = require('perf_hooks');

const AppUtils = new CoreUtils();

const themes = {
    'default': {
        'logo': chalk.blue(`
    ____  ___   ________ __ _______   ______ 
   / __ )/   | / ____/ //_// ____/ | / / __ /
  / __  / /| |/ /   / //  / __/ /  |/ / / / /
 / /_/ / ___ / /___/ /| |/ /___/ /|  / /_/ / 
/_____/_/  |_/____/_/ |_/_____/_/ |_/_____/  
`),
        'menu': chalk.whiteBright,
        'input': chalk.yellow,
        'password': chalk.yellow,
        'success': chalk.greenBright,
        'error': chalk.redBright,
        'countdown': chalk.yellow,
        'list': chalk.white,
        'listHeader': chalk.whiteBright,
        'listId': chalk.yellow,
        'listUsername': chalk.yellow,
        'listEmail': chalk.yellow,
        'listCreatedAt': chalk.yellow,
    },
    'dark': {
        'logo': chalk.magenta(`
    ____  ___   ________ __ _______   ______ 
   / __ )/   | / ____/ //_// ____/ | / / __ /
  / __  / /| |/ /   / //  / __/ /  |/ / / / /
 / /_/ / ___ / /___/ /| |/ /___/ /|  / /_/ / 
/_____/_/  |_/____/_/ |_/_____/_/ |_/_____/  
`),
        'menu': chalk.whiteBright,
        'input': chalk.yellow,
        'password': chalk.yellow,
        'success': chalk.greenBright,
        'error': chalk.redBright,
        'countdown': chalk.yellow,
        'list': chalk.white,
        'listHeader': chalk.whiteBright,
        'listId': chalk.yellow,
        'listUsername': chalk.yellow,
        'listEmail': chalk.yellow,
        'listCreatedAt': chalk.yellow,
    },
};



async function countdown(ms, int) {
    if (ms === undefined) {
        ms = 3000;
    }
    if (int === undefined) {
        function getStartingNumber(integer) {const str = integer.toString();let startingNumber = '';for (let i = 0; i < str.length; i++) {if (!isNaN(parseInt(str[i]))) {startingNumber = str[i];break;}}return parseInt(startingNumber);}
        int = getStartingNumber(ms)
    }
    process.stdout.write(themes['default'].countdown('Returning to main menu in: '));
    for (let i = int; i > 0; i--) {
        process.stdout.write(themes['default'].countdown(i.toString()));
        await new Promise(resolve => setTimeout(resolve, ms/5));
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(themes['default'].countdown('Returning to main menu in: '));
    }
    main();
}
main()
async function main() {
console.clear()
console.log(themes['default'].logo)
const answer = await inquirer.prompt({ type: 'list', name: 'menu', message: themes['default'].menu('What action do you want to do?'), choices: ['Log In', 'Sign Up', 'List', 'Themes', 'Exit']});
if (answer.menu == 'Log In') {
    const logusername = (await inquirer.prompt({ type: 'input', name: 'username', message: themes['default'].input('Please enter your username @;')})).username;
    const logpassword = (await inquirer.prompt({ type: 'password', name: 'password', message: themes['default'].password('Please enter your password @;')})).password;
    try {
        const loginSuccessful = await AppUtils.login(logusername, logpassword);
        if (loginSuccessful) {
            console.log(themes['default'].success(`Welcome, ${logusername}\n`));
            const opt = inquirer.prompt({ type: 'list', name: 'optmenu', message: themes['default'].menu('What action do you want to do?'), choices: ['Change Password', 'Sign Up', 'List', 'Options', 'Exit']});
            if (opt.optmenu == 'Options') {
                const theme = await inquirer.prompt({ type: 'list', name: 'theme', message: themes['default'].menu('What theme do you want to use?'), choices: ['Default', 'Dark']});
                if (theme.theme == 'Dark') {
                    console.clear();
                    console.log(themes['dark'].logo);
                }
            }
        } else {
            console.log(themes['default'].error('Login failed'));
            countdown()
        }
    } catch (err) {
        console.log(themes['default'].error('Login error:', err));
        countdown()
    }
} else if (answer.menu == 'Sign Up') {
    const regusername = (await inquirer.prompt({ type: 'input', name: 'username', message: themes['default'].input('Please enter your username @;')})).username;
    const regemail = (await inquirer.prompt({ type: 'input', name: 'email', message: themes['default'].input('Please enter your email @;')})).email;
    let regpassword = '';
    while (true) {
        regpassword = (await inquirer.prompt({ type: 'password', name: 'password', message: themes['default'].password('Please enter your password @;')})).password;
        const confirmPassword = (await inquirer.prompt({ type: 'password', name: 'confirmPassword', message: themes['default'].password('Please confirm your password @;')})).confirmPassword;
        if (regpassword === confirmPassword) break;
        console.log(themes['default'].error('Passwords do not match. Please try again.'));
        countdown()
    }
    try {
        await AppUtils.register(regusername, regpassword, regemail);
        console.log(themes['default'].success('Registration successful ✅'));
        countdown()
        
    } catch (err) {
        console.log(themes['default'].error('Registration failed:', err));
        countdown()
    }
} else if (answer.menu == 'List') {
    try {
        const users = await AppUtils.listUsers();
        console.log(themes['default'].listHeader('List of users:'));
        users.forEach(user => {
            console.log(`${themes['default'].listId('ID:')} ${user.id}, ${themes['default'].listUsername('Username:')} ${user.username}, ${themes['default'].listEmail('Email:')} ${user.email}, ${themes['default'].listCreatedAt('Created At:')} ${user.created_at}`);
        });
        countdown(5000)
    } catch (err) {
        console.log(themes['default'].error('Error listing users:', err));
        countdown()
    }
} else if (answer.menu == 'Options') {
    const theme = await inquirer.prompt({ type: 'list', name: 'theme', message: themes['default'].menu('What theme do you want to use?'), choices: ['Default', 'Dark']});
    if (theme.theme == 'Dark') {
        console.clear();
        console.log(themes['dark'].logo);
    }
}
}