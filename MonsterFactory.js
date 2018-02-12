const Dice = require('./Dice');
const MonsterTypes = require('./MonsterTypes');
const Monster = require('./Monster');


const types = [
    MonsterTypes.FIRE_GOLEM,
    MonsterTypes.DRAGON,
    MonsterTypes.CRAB,
    MonsterTypes.SNOW_QUEEN,
    MonsterTypes.TREANT,
    MonsterTypes.WISP,
    MonsterTypes.CYBORG,
    MonsterTypes.WIZARD,
];

module.exports = MonsterFactory = {

    create(battleNumber, dice = new Dice()) {
        const type =  types[dice.roll(0,7)];
        const level = battleNumber;
        const monster = new Monster(level, type.name, type.element, type.magic);
        return monster;
    },
}