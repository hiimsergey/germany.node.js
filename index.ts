const de = require('./germany.ts')
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

let commandID: string = '',
    filter: Array<string>,
    input: string,
    output: string,
    outputLetter: string = '',
    written: Array<string> = [],
    hp: any,
    settings: any = 3

function main() {
    hp = settings
    console.clear()
    console.log(de.menu)
    rl.question('', (menuInput: string) => {
        switch (menuInput) {
            case 'p':
                console.clear()
                console.log('Loading game...')
                setTimeout(() => {
                    console.clear()
                    play()
                }, 500)
                break
            case 's':
                openSettings()
                break
            case 'r':
                showRules(1)
                break
            case 'a':
                console.clear()
                console.log(de.about)
                rl.question('', () => main())
                break
            case 'q':
                console.log('Quitting game...')
                setTimeout(() => rl.close(), 250)
                break
            default:
                console.log('\x1b[31m%s', 'Please select something!')
                setTimeout(() => main(), 250)
                break
        }
    })
}

function play() {
    // Get output
    filter = de.cities.filter((city: string) => city.startsWith(outputLetter.toUpperCase()))
    if (commandID === '') {
        output = filter[Math.floor(Math.random() * filter.length)]
    } else {
        output = output
        commandID = ''
    }
    console.log('\x1b[36m%s\x1b[0m', output)
    // Ask for input
    rl.question('', (input: string) => {
        input = checkSpaces(input)
        if (input[0] === '/') {
            command(input)
        } else if (validInput(input, output)) {
            outputLetter = lastLetter(input)
            de.cities.splice(de.cities.indexOf(input), 1)
            written[written.length] = input
            play()
        } else {
            hp--
            console.log('\x1b[31m%s\x1b[0m', '\nWRONG!\n')
            outputLetter = output[output.length - 1]
            if (hp === 0) {
                filter = de.cities.filter((city: string) => city.startsWith(outputLetter.toUpperCase()))
                setTimeout(() => console.log(`
\x1b[31mGAME OVER!
 
You wrote \x1b[33m${written.length} \x1b[31mcities correctly.
Possible answer to last city: \x1b[36m${filter[Math.floor(Math.random() * filter.length)]}
\x1b[90m.............................................
 
\x1b[92m<  q   > \x1b[94mQuit
\x1b[92m< else > \x1b[94mMenu\x1b[0m
`), 500)
                rl.question('', (gameOverInput: string) => {
                    if (gameOverInput === 'q') {
                        console.log('Quitting game...')
                        setTimeout(() => process.exit(), 250)
                    }
                    else {
                        for (const city of written) de.cities[de.cities.length] = city
                        written = []
                        main()
                    }
                })
            } else {
                setTimeout(() => play(), 500)
            }
        }
    })
}

function showRules(page: number) {
    console.clear()
    console.log(de.rules[page - 1])
    rl.question('', (rulesInput: string) => {
        switch (rulesInput) {
            case 'n':
                showRules(page === 3 ? 1 : page + 1)
                break
            default:
                main()
                break
        }
    })
}

function openSettings() {
    console.clear()
    console.log(`
${de.settingsBanner}
\x1b[34mHP\x1b[33m: ${settings}
\x1b[90m// Other settings coming soon...
${de.options}
`)
    rl.question('', (settingsInput: any) => {
        if (!isNaN(settingsInput) && settingsInput !== '') {
            settings = Number(settingsInput)
            openSettings()
        }
        else if (settingsInput === '') main()
        else {
            console.log('\x1b[31m%s\x1b[0m', 'Please select something valid!')
            setTimeout(() => openSettings(), 250)
        }
    })
}

function checkSpaces(input: string): string {
    for (let i = 0; i < input.length; i++) {
        if (input[i] !== ' ') {
            return input.slice(i, input.length)
        }
    }
    return input
}

function validInput(input: string, output: string) {
    return de.cities.includes(input)
    && input[0].toLowerCase() === lastLetter(output)
}

function lastLetter(string: string): string {
    if (string.includes('/')) return string[string.indexOf('/') - 1]
    if (string[string.length - 1] === 'y' ||
        string[string.length - 1] === 'ß') return string[string.length - 2]
    return string[string.length - 1]
}

function command (input: string) {
    commandID = input.slice(1, input.length)
    switch (commandID) {
        case 'clear':
            console.clear()
            break
        case 'commands':
            console.log(de.commands)
            break
        case 'quit':
            console.log('Quitting game...')
            process.exit()
        case 'stats':
            console.log(`
\x1b[34mscore\x1b[33m: ${written.length}
\x1b[34mhp\x1b[33m:    ${hp}
`)
            break
        case 'written':
            console.clear()
            written.sort()
            if (written.length === 0) {
                console.log('\x1b[90m%s\x1b[0m', 'Nothing there yet...')
            } else {
                for (let i = 0; i < written.length; i++) {
                    console.log('\x1b[35m%s\x1b[0m',written[i])
                }
            }
            console.log()
            break
        default:
            console.log('\x1b[31m%s', '\nInvalid command!\n')
            commandID = ' '
            break
    }
    play()
}

main()
