// menu interaktiv machen
// slash-commands:
//      /commands
//      /score
//      /hp
//      /called
//      /quit
//      /menu
//          make it then print 'weak'
// take response without <cr> 
// modes:
//      view mode
//          just list all the cities
//          search by letter
//  settings:
//      only one try
//      delete cities named by machine
//      play against yourself

const de = require('./germany.ts')
const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

function main() {
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
            // TODO
            // case 's':
            //     break
            case 'r':
                console.clear()
                console.log(de.rules)
                rl.question('', () => main())
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

let output: string,
    filter: Array<string>,
    outputLetter: string = '',
    commandID: string = ''

function play() {
    // Get output
    filter = de.cities.filter((city: string) => city.startsWith(outputLetter.toUpperCase()))
    if (commandID === '') {
        output = filter[Math.floor(Math.random() * filter.length)]
        commandID = ''
    } else {
        output = output
        commandID = ''
    }
    console.log('\x1b[36m%s\x1b[0m', output)
    // Ask for input
    rl.question('', (input: string) => {
        input = checkSpaces(input)
        if (input[0] === '/') { // TODO change
            command(input)
        } else if (validInput(output, input)) {
            outputLetter = lastLetter(input)
            de.cities.splice(de.cities.indexOf(input), 1)
            play()
        } else {
            console.log('\x1b[31m%s\x1b[0m', '\nWRONG!\n')
            outputLetter = output[output.length - 1]
            setTimeout(() => play(), 500)
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

function validInput(output: string, input: string) {
    return de.cities.includes(input)
    && input[0].toLowerCase() === lastLetter(output) // TODO change
}

function lastLetter(string: string): string {
    if (string.includes('/')) return string[string.indexOf('/') - 1]
    if (string[string.length - 1] === 'y') return string[string.length - 2]
    return string[string.length - 1]
}

function command (input: string) {
    commandID = input.slice(1, input.length)
    switch (commandID) {
        case 'quit':
            process.exit()
        default:
            console.log('undefined') // TODO
            break
    }
    play()
}

main()
