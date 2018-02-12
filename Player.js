const Entity = require('./Entity')
const Config = require('./Config')
const Elements = require('./Elements')
const Actions = require('./Actions')


module.exports = class Player extends Entity {
    constructor(element) {
        super(Config.PLAYER_STARTING_LEVEL, "Player", element);
        this.setupStats();
        this.exp = 0;
    }

    setupStats() {
        const hp = this.level * 5 + 35;
        const mp = 3 + Math.floor(this.level / 5);
        const attack = this.level + 6;
        const magic = this.level + 6;
        this.setHP(hp);
        this.setMaxHP(hp);
        this.setMP(mp);
        this.setMaxMP(mp);
        this.setAttack(attack);
        this.setMagic(magic);
    }

    /**
     * Attempts to do a given action.
     * 
     * If the player can currently do the action it will.
     * In case the action can not be done, returns an object
     * where object.valid = false and object.message
     * contains the reason of failure.
     * 
     * @param {number} action - Chosen action.
     * @param {Entity} entity - Target entity.
     * @param {number} hitRoll - Number from 1-100 to determine if action hits.
     *  
     * @returns Object with valid true if action valid and optional message. 
     */
    doAction(action, entity, hitRoll) {
        switch (action) {
            case Actions.ATTACK:
                return this.doAttack(entity, hitRoll);
            case Actions.DEFEND:
                return this.doDefend();
            case Actions.SPELL:
                return this.doSpell(entity);    
            case Actions.HEAL:
                return this.doHeal();
         
            default:
                return {valid: false, message: 'Invalid action!'}
        }
    }

    doAttack(entity, hitRoll) {
        if (!entity) {
            return {type: Actions.ATTACK, valid: false, message: 'Attack target not provided.'};
        }
        if (hitRoll > 10) {
            const dmg = entity.applyDamage(this.attack);
            return {type: Actions.ATTACK, valid: true, dmg: dmg, hit: true};

        } else {
            return {type: Actions.ATTACK, valid: true, hit: false};
        }
    }

    doDefend() {
        this.defend();
        return {type: Actions.DEFEND, valid: true};
    }

    doSpell(entity) {
        if (!entity) {
            return {type: Actions.SPELL, valid: false, message: 'Spell target not provided.'};
        }
        if (this.getMP() >= 2) {
            this.setMP(this.getMP() - 2);
            const dmg  = entity.applyDamage(this.magic, this.element);
            return {type: Actions.SPELL, valid: true, dmg: dmg};
        } else {
            return {type: Actions.SPELL, valid: false, message: 'Not enough mana to cast spell.'};
        }
    }
    
    doHeal() {
        if (this.getMP() >= 3) {
            const healAmount = this.getMaxHP() / 5;
            this.setHP(this.getHP() + healAmount);
            this.setMP(this.getMP() - 3);
            return {type: Actions.HEAL, valid: true, heal: healAmount};
        } else {
            return {type: Actions.HEAL, valid: false, message: 'Not enough mana to cast heal.'}
        }
    }

    /**
     * Adds experience points to the Player.
     * 
     * @param {number} exp - Amount of experience points to add.
     * @returns {boolean} - True if Player leveled up, false if not.
     */
    addExp(exp) {
        this.exp += exp;
        const neededExp = (this.level - 1) * 15 + 10;
        if (this.exp >= neededExp) {
            this.exp = 0;
            this.levelUp();
            return true;
        } else {
            return false;
        }
    }

    levelUp() {
        this.level += 1;
        const hp = this.getHP(); 
        const mp = this.getMP();
        this.setupStats();
        this.setHP(hp);
        this.setMP(mp);
    }

    /**
     * Notifies the player of the turn starting so it can setup accordingly.
     * 
     * The player should regenerate MP and remove defending status when
     * the turn starts.
     */
    turnStart() {
        this.endDefend();
        const newMana = Math.min(this.getMaxMP(), this.getMP() + 1);    
        this.setMP(newMana);
    }
};