const Dice = require('./Dice');
const Player = require('./Player');
const Elements = require('./Elements');
const MonsterFactory = require('./MonsterFactory');
const BattleTextBuilder = require('./BattleTextBuilder');

const readline = require('readline');

const WELCOME_TEXT =`

>>   +──────────────────+   <<
>>   |    Welcome to    |   <<
>>   | Battle Simulator |   <<
>>   +──────────────────+   <<
`;

const printGameOverText = (battleNumber) => {
    const endText =`

              ───────────────
              ─= GAME OVER =─
              ───────────────

  Congratulations you made it to battle ${battleNumber}!

`;
    console.log(endText);
}


module.exports = class Game {
    constructor(dice) {
        this.dice = dice || new Dice();
        this.battleNumber = 1;
        this.battleTextBuilder = new BattleTextBuilder();
    }

    /**
     * Starts the gameloop.
     */
    start() {
        this.rl = readline.createInterface(process.stdin, process.stdout);
        this.rl.setPrompt(">");

        // Create player
        this.player = new Player(this.randomElement());
        
        console.log(WELCOME_TEXT);
        // Start battle
        this.startBattleRound();   

        this.rl.on('line', input => this.receiveInput(input));
    };

    receiveInput(input) {
        const command = Number(input);
        const action = this.player.doAction(command, this.monster, this.dice.roll(1,100));
        if (action.valid) {
            this.printPlayerAction(action, this.monster);
            if (this.monster.isAlive()) {
                this.enemyTurn();
                if (this.player.isAlive()) {
                    this.turnStart();
                    this.getCommand();
                } else {
                    this.endGame();
                }
            } else {
                this.endBattleRound();
                this.startBattleRound();
            }
        } else {
            console.log(action.message);
            this.getCommand();
        }
    }


    turnStart() {
        this.player.turnStart();

        const btb = this.battleTextBuilder;
        const monster = {
            name: this.monster.getName(),
            HP: this.monster.getHP(),
            maxHP: this.monster.getMaxHP(),
        }
        const player = {
            name: this.player.getName(),
            HP: this.player.getHP(),
            maxHP: this.player.getMaxHP(),
            MP: this.player.getMP(),
            maxMP: this.player.getMaxMP(),
        }

        const monsterStats = btb.createStatusTextForEntity(monster);
        const playerStats = btb.createStatusTextForEntity(player);

        console.log();
        console.log(monsterStats);
        console.log("──────────────────────");
        console.log(playerStats);
        console.log();

    }

    printPlayerAction(action) {
        const text = this.battleTextBuilder.createTextForAction(action, 'Player', this.monster.getName());
        console.log('>> ' + text);
    }

    startBattleRound() {
        this.monster = MonsterFactory.create(this.battleNumber);
        // Print battle start info
        console.log();
        console.log(`────── Battle ${this.battleNumber} ──────`);
        console.log();
        this.turnStart();
        this.getCommand();
    }
    
    endBattleRound() {
        const reward = this.monster.getReward();
        const leveledUp = this.player.addExp(reward.exp);
        if (leveledUp) {
            const name = this.player.getName();
            const level = this.player.getLevel();
            console.log();
            console.log("+                                       +");
            console.log();
            console.log("────────────    LEVEL UP    ────────────");
            console.log(`    ${name} leveled up to level ${level}!`);
            console.log("────────────────────────────────────────");
            console.log();
            console.log("+                                       +");
        }
        this.battleNumber++;
    }

    getCommand() {
        console.log("1 Attack 2 Defend 3 Magic 4 Heal");
        this.rl.prompt();
    }

    endGame() {
        printGameOverText(this.battleNumber);
        this.rl.close();
    }

    enemyTurn() {
        const action = this.monster.fight(this.player, this.dice.roll(1,100));
        const name = this.monster.getName();
        const targetName = this.player.getName();
        const text = this.battleTextBuilder.createTextForAction(action, name, targetName);
        console.log('<< ' + text);
    }

    randomElement() {
        const number = this.dice.roll(1,4);
        switch (number) {
            case 1:
                return Elements.FIRE;
            case 2:
                return Elements.WATER;
            case 3:
                return Elements.EARTH;
            case 4:
                return Elements.LIGHTNING;
            default:
                return Elements.NORMAL;
        }
    }

    /**
     * Gets the games current state.
     * 
     * @returns The game's state.
     */
    getState() {
        return this.state;
    };
}