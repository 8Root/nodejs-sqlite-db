const inquirer = require("inquirer");
const CoreUtils = require("./lib/utils");
const cliProgress = require('cli-progress');
const chalk = require('chalk');
const { performance } = require('perf_hooks');

const AppUtils = new CoreUtils();

let logo = `
    ____  ___   ________ __ _______   ______ 
   / __ )/   | / ____/ //_// ____/ | / / __ /
  / __  / /| |/ /   / //  / __/ /  |/ / / / /
 / /_/ / ___ / /___/ /| |/ /___/ /|  / /_/ / 
/_____/_/  |_/____/_/ |_/_____/_/ |_/_____/  
`;

main()
async function main() {
console.clear()
console.log(logo)
const answer = await inquirer.prompt({ type: 'list', name: 'menu', message: 'What action do you want to do?', choices: ['Log In', 'Sign Up', 'List', 'Options', 'Exit']});
console.clear();
console.log(logo);
if (answer.menu == 'Log In') {
    const logusername = (await inquirer.prompt({ type: 'input', name: 'username', message: 'Please enter your username @;'})).username;
    const logpassword = (await inquirer.prompt({ type: 'password', name: 'password', message: 'Please enter your password @;'})).password;
    try {
        const loginSuccessful = await AppUtils.login(logusername, logpassword);
        if (loginSuccessful) {
            console.log(`Welcome, ${logusername}\n`);
            const opt = inquirer.prompt({ type: 'list', name: 'optmenu', message: 'What action do you want to do?', choices: ['Change Password', 'Sign Up', 'List', 'Options', 'Exit']});
        } else {
            console.log('Login failed');
            main()
        }
    } catch (err) {
        console.log('Login error:', err);
        main()
    }
} else if (answer.menu == 'Sign Up') {
    const regusername = (await inquirer.prompt({ type: 'input', name: 'username', message: 'Please enter your username @;'})).username;
    const regemail = (await inquirer.prompt({ type: 'input', name: 'email', message: 'Please enter your email @;'})).email;
    let regpassword = '';
    while (true) {
        regpassword = (await inquirer.prompt({ type: 'password', name: 'password', message: 'Please enter your password @;'})).password;
        const confirmPassword = (await inquirer.prompt({ type: 'password', name: 'confirmPassword', message: 'Please confirm your password @;'})).confirmPassword;
        if (regpassword === confirmPassword) break;
        console.log('Passwords do not match. Please try again.');
        main()
    }
    try {
        await AppUtils.register(regusername, regpassword, regemail);
        console.log('Registration successful');
        AppUtils.delay(5000)
        main()
    } catch (err) {
        console.log('Registration failed:', err);
        main()
    }
} else if (answer.menu == 'List') {
    try {
        const users = await AppUtils.listUsers();
        console.log('List of users:');
        users.forEach(user => {
            console.log(`ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Created At: ${user.created_at}`);
        });
        process.stdout.write('Returning to main menu in: ');
        for (let i = 5; i > 0; i--) {
            process.stdout.write(chalk.yellow(i.toString()));
            await new Promise(resolve => setTimeout(resolve, 1000));
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write('Returning to main menu in: ');
        }
        console.log();
        main();
    } catch (err) {
        console.log('Error listing users:', err);
        main()
    }
}
}