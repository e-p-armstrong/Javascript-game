const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';
const characterCharacter = 'P'

class Field {
    constructor (){
        this.fieldArr = [[]]
        this.playerIndex = [0,0]
        this.print = this.print.bind(this)
        this.generateField = this.generateField.bind(this)
        
    }
    print() {
        const partiallyJoined = this.fieldArr.map(line => line.join(''))
        // console.log(partiallyJoined)
        
        console.log(partiallyJoined.join('\n')) // Logs to the console. Each array in the 2d array is joined into a single string, and then each of these arrays is joined with newlines between them.
    }
    generateField(){
        const charactersToChoose = [hole,fieldCharacter,fieldCharacter,fieldCharacter]
        const startingRow = [characterCharacter,fieldCharacter,fieldCharacter,fieldCharacter];
        const resultArray = [startingRow]
        for (let i = 0; i < 6; i++){
            const numberLessThanThree = () => Math.floor(Math.random()*4);
            const newChar = () => charactersToChoose[numberLessThanThree()];
            const newArrayLine = ([newChar(),newChar(),newChar(),newChar()]);
            resultArray.push(newArrayLine)
        }

        const finalRow = [hole,hole,fieldCharacter,hat]
        resultArray.push(finalRow)
        this.fieldArr = resultArray
    }
    move (instruction) {
        // console.log("move running with value:", instruction)
        const playerY = this.playerIndex[0];
        const playerX = this.playerIndex[1];
        this.fieldArr[playerY][playerX] = pathCharacter;
        const cleanedUpInst = instruction.toLowerCase().trim();
        if (cleanedUpInst === 'u') {
            this.playerIndex[0] = this.playerIndex[0] - 1
        } else if(cleanedUpInst === 'd'){
            this.playerIndex[0] = this.playerIndex[0] + 1
        } else if(cleanedUpInst === 'l'){
            this.playerIndex[1] = this.playerIndex[1] - 1
        } else if(cleanedUpInst === 'r'){
            this.playerIndex[1] = this.playerIndex[1] + 1
        } else {
            console.log("please enter a valid input! (u,d,l,r)\n") //For some reason the prompt was running each time a new character was entered. This is a workaround.
            const reminder = prompt()
            return this.move(reminder)
            
        }
        let charAtNewIndex
        try {
            charAtNewIndex = this.fieldArr[this.playerIndex[0]][this.playerIndex[1]];
        } catch (e){
            charAtNewIndex = undefined
        }
        
        if (charAtNewIndex === hole) {
            console.log("AAAAaaaaaaaahhhhhhhhhhh......")
            return 'death!';
        } else if (charAtNewIndex === undefined) {
            console.log("Are you blind? That was clearly out of bounds.")
            return 'out of bounds!';
        } else if (charAtNewIndex === hat){
            return "hat found!";
        } else{
            this.fieldArr[this.playerIndex[0]][this.playerIndex[1]] = characterCharacter;
            return 'success!'
        }
        console.log("reached a part that should never be reached! ERROR! ERROR! AHHHHHHHHHHH also here's what charAtNewIndex and the player indecies are respectively",charAtNewIndex,this.playerIndex[0],this.playerIndex[1])
    }
}


console.log("The quest for the hat!")
function runGame () {
    //Setup. Makes the field, logs the field, says that the hat has not been found.
    const gameField = new Field()
    gameField.generateField()
    let hatfound = false;
    let dead  = false;
    let movesMade = 0
    gameField.print();
    while (!hatfound && !dead){
        console.log(`Moves made so far: ${movesMade}`)
        movesMade++
        console.log('Where will you move? (options: u,d,l,r)\n')
        const instruction = prompt()
        // console.log("instruction is:", instruction)
        const outcome = gameField.move(instruction); //Carries out the movement, and gets its outcome
        if (outcome === "death!"){
            dead = true;
        } else if (outcome === "hat found!"){
            hatfound = true;
        } else if (outcome === "out of bounds!"){
            dead  = true;
        } else if (outcome === "success!"){

        } else {
            console.log("Error in movement function, outcome was:", outcome)
        }
        gameField.print()
    }
    //Handle victory or loss after while loop stops.
    if (hatfound) {
        const response = prompt(`Congratulations! You win! You made ${movesMade} moves, you ${ movesMade > 12 ? 'laggard' : 'speed demon'}! Would you like to play again? y/n`)
        if (response === 'y'){
            runGame()
        } else{
            process.exit()
        }
    }
    else {
        const response = prompt("You dead. Would you like to play again? y/n")
        if (response === 'y'){
            runGame()
        } else{
            process.exit()
        }
    }
}
runGame()