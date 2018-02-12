const Entity = require('./Entity')
const Config = require('./Config')
const Elements = require('./Elements')
const Actions = require('./Actions')


module.exports = class BattleTextBuilder {
    constructor() {

    }

    /**
     * Creates a text to print from the given action and actor.
     * 
     * @param {object} action - Action object 
     * @param {string} actorName - Name of the acting entity
     * @param {string} targetName - Name of the target entity
     */
    createTextForAction(action, actorName, targetName) {
        switch (action.type) {
            case Actions.ATTACK:
                return this.playerAttackText(action, actorName, targetName);
            case Actions.DEFEND:
                return this.playerDefendText(action, actorName);
            case Actions.SPELL:
                return this.playerSpellText(action, actorName, targetName);
            case Actions.HEAL:
                return this.playerHealText(action, actorName);
            case undefined:
                throw "Action has no type."
            default:
                throw "Invalid action type."
        }
    }

    /**
     * Creates status text for the given entity.
     * 
     * Creates a text containing the entitys current HP and MP status
     * if the entity has these stats.
     * 
     * @param {Entity} entity - Entity to create the status the from.
     */
    createStatusTextForEntity(entity) {
        const name = entity.name;
        const HP = entity.HP;
        const maxHP = entity.maxHP;
        const MP = entity.MP;
        const maxMP = entity.maxMP;

        if (maxMP !== undefined && MP !== undefined) {
            return `${name}\nHP ${HP}/${maxHP}\nMP ${MP}/${maxMP}`;
        } else {
            return `${name}\nHP ${HP}/${maxHP}`;
        }
    }

    playerAttackText(action, actorName, targetName) { 
        if (action.hit) {
            return `${actorName} hit the ${targetName} for ${action.dmg} damage!`;
        } else {
            return `${actorName} missed the ${targetName}!`;
        }
    }
    
    playerDefendText(action, actorName) {
        return `${actorName} took defensive stance!`;
    }
    
    playerSpellText(action, actorName, targetName) {
        return `Spell cast by ${actorName} hits the ${targetName} for ${action.dmg} damage!`;
    }
    
    playerHealText(action, actorName) {
        return `${actorName} healed ${action.heal} health!`;
    }
}
