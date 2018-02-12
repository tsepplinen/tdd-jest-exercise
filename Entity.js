const Elements = require('./Elements');

module.exports = class Entity {
    
    constructor(level = 1, name = "Unknown", element = Elements.NORMAL) {
        this.initialize(level, name, element);
    }

    /**
     * Initializes the entity.
     * 
     * @param {Elements} element - Element to set for the entity.
     */
    initialize(level, name, element) {
        this.level = level;
        this.name = name;
        this.setElement(element);
        this.hp = 100;
        this.mp = 3;
        this.maxHP = 100;
        this.maxMP = 3;
        this.isDefending = false;
        this.alive = true;
        this.attack = 1;
        this.magic = 1;
    }


    getAttack() {
        return this.attack;
    }

    setAttack(attack) {
        this.attack = attack;
    }

    getMagic() {
        return this.magic;
    }
    
    setMagic(magic) {
        this.magic = magic;
    }

    getName() {
        return this.name;
    }

    setElement(element) {
        this.element = element;
    }

    /**
     * Resets the entity to maximum HP and MP.
     * 
     * Fills up the HP and MP of the entity and 
     * reset the entitys state back to default.
     */
    reset() {
        this.setHP(this.getMaxHP());
        this.setMP(this.getMaxMP());
        this.alive = true;
        this.isDefending = false;
    }

    getLevel() {
        return this.level;
    }

    getElement() {
        return this.element;
    }

    isAlive() {
        return this.alive;
    }

    /**
     * Sets the entity in defending state.
     * 
     * When defending, the entity should take reduced
     * damage from all types of attacks.
     */
    defend() {
        this.isDefending = true;
    }

    /**
     * Sets the entity to no more be in defending state.
     */
    endDefend() {
        this.isDefending = false;
    }

    /**
     * Gets the entitys defending state.
     */
    getDefending() {
        return this.isDefending;
    }

    /**
     * Sets the entity's HP to given amount.
     * 
     * @param {number} amount - Amount to set the HP to. 
     */
    setHP(amount) {

        if (amount >= this.maxHP) {
            amount = this.maxHP;
        }
        this.hp = amount;
    }

    /**
     * Gets the entity's HP.
     * 
     * @returns The entity's HP.
     */
    getHP() {
        return this.hp;   
    }

    /**
     * Sets the entity's MP to given amount.
     * 
     * @param {number} amount - Amount to set the MP to. 
     */
    setMP(amount) {
        this.mp = amount;
    }

    /**
     * Gets the entity's MP.
     * 
     * @returns The entity's MP.
     */
    getMP() {
        return this.mp;   
    }

    /**
     * Gets the entity's maximum HP.
     * 
     * @returns The entity's maximum HP.
     */
    getMaxHP() {
        return this.maxHP;
    }

    /**
     * Sets the entity's maximum HP.
     * 
     * @param {number} maxHP - Maximum HP to set.
     */
    setMaxHP(maxHP) {
        this.maxHP = maxHP;
        this.setHP(Math.min(this.getHP(), maxHP));
    }

    /**
     * Gets the entity's maximum MP.
     * 
     * @returns The entity's maximum MP.
     */
    getMaxMP() {
        return this.maxMP;
    }

    /**
     * Sets the entity's maximum MP.
     * 
     * @param {number} maxMP - Maximum MP to set.
     */
    setMaxMP(maxMP) {
        this.maxMP = maxMP;
        this.setMP(Math.min(this.getMP(), maxMP));
    }


    /**
     * Checks if this entity is strong agains the given element.
     * 
     * @param {Elements} element - Element to check strength agains.
     * @returns {boolean} - True if strong agains element, false otherwise.
     */
    isStrongAgainst(element) {
        switch (this.element) {
            case Elements.EARTH:
                return element === Elements.LIGHTNING
            case Elements.FIRE:
                return element === Elements.EARTH
            case Elements.LIGHTNING:
                return element === Elements.WATER
            case Elements.WATER:
                return element === Elements.FIRE
            default:
                return false;
        }
    }

    /**
     * Checks if this entity is weak to the given element.
     * 
     * @param {Elements} element - Element to check if weak to.
     * @returns {boolean} - True if weak to element, false otherwise.
     */
    isWeakTo(element) {
        switch (this.element) {
            case Elements.EARTH:
                return element === Elements.FIRE;
            case Elements.FIRE:
                return element === Elements.WATER;
            case Elements.LIGHTNING:
                return element === Elements.EARTH;
            case Elements.WATER:
                return element === Elements.LIGHTNING;
            default:
                return false;
        }
    }

    /**
     * Applies damage to the entity's health.
     * 
     * Uses the amount of damage and the type of the damage and
     * the entity's current state to calculate how much damage the
     * entity should take and then removes the calculated amount 
     * of health points from the entity.
     * 
     * @param {number}     amount - The amount of incoming damage.
     * @param {DamageType} type   - The type of the damage.
     * 
     * @returns {number} - The amount of damage received.
     */
    applyDamage(amount, damageType = Elements.NORMAL) {
        let damage;

        // Elements.is(this.type).strongAgainst(damageType);
        if (this.isStrongAgainst(damageType)) {
            damage = amount / 2;
        } else if (this.isWeakTo(damageType)) {
            damage = amount * 2;
        } else {
            damage = amount;
        }

        if (this.isDefending) {
            damage = damage / 2;
        }

        this.setHP(this.getHP() - damage);

        if (this.getHP() <= 0) {
            this.alive = false;
        }
        return damage;
    }
}