const Entity = require('./Entity');

module.exports = class Monster extends Entity {
    
    constructor(level, name, element, isSpellCaster) {
        super(level, name, element);
        this.isSpellCaster = isSpellCaster;
        const hp = level * (4 + Math.floor(level/10)) + 16;
        this.setHP(hp);
        this.setMaxHP(hp);
        this.setAttack(level + 2);
        this.setMagic(Math.floor(level/2)+1);
    }

    /**
     * The monster does it's turn in battle against the given entity.
     * 
     * @param {Entity} entity - The entity being fought.
     * @param {number} hitRoll - Roll of dice from 1 to 100 determining accuracy.
     */
    fight(entity, hitRoll) {
        if (this.isSpellCaster) {
            const damage = this.getMagic();
            const damageDone = entity.applyDamage(damage, this.getElement());
            return {type: 'spell', dmg: damageDone, hit: true}; 
        } else {
            if (hitRoll <= 20) {
                return {type: 'attack', hit: false};  
            } else {
                const damage = this.getAttack();
                const damageDone = entity.applyDamage(damage);
                return {type: 'attack', dmg: damageDone, hit: true};  
            }
        }
    }

    /**
     * Gets the rewards given by this monster when defeated.
     * 
     * The return value should contain all the rewards given
     * when this monster is defeated like the amount of 
     * experience points.
     * 
     * @returns { {exp:number} } - Object containing the monsters rewards. 
     */
    getReward() {
        const exp = this.level * 10;
        return {exp};  
    }
}