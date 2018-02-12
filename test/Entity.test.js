const Entity = require('../Entity');
const Elements = require('../Elements');

describe('Entity', () => {
    let e;

    beforeAll(() => {
        e = new Entity();
    });

    beforeEach(() => {
        e.reset();
    });

    test('should be fully initialized', () => {
        expect(e.getName()).toBe("Unknown");
        expect(e.getHP()).toBe(e.getMaxHP());
        expect(e.getMP()).toBe(e.getMaxMP());
        expect(e.getElement()).toBeDefined();
        expect(e.getLevel()).toBeDefined();
        expect(e.getLevel()).toBe(1);
    });

    test('should reset to full health and mana and back to life', () => {
        e.setHP(1);
        e.setMP(1);
        e.applyDamage(1);
        
        e.reset();
        expect(e.getHP()).toBe(e.getMaxHP());
        expect(e.getMP()).toBe(e.getMaxMP());
        expect(e.isAlive()).toBeTruthy();
    });

    test('should set and get HP', () => {
        e.setHP(1);
        expect(e.getHP()).toBe(1);
    });

    test('should limit hp to maxHP', () => {
        e.setHP(e.getMaxHP() + 100);
        expect(e.getHP()).toBe(e.getMaxHP());
    });

    test('should set and get MP', () => {
        e.setMP(1);
        expect(e.getMP()).toBe(1);
    });

    test('should reset to not defending', () => {
        e.defend();
        e.reset();
        expect(e.isDefending).toBeFalsy();
    });

    test('should return amount of damage taken', () => {
        const damage = 5;
        const damageTaken = e.applyDamage(damage);
        expect(damageTaken).toBe(damage);
    });

    test('should take normal damage from attack', () => {
        const damage = 5;
        const expectedHP = e.getMaxHP() - damage;
        e.applyDamage(damage);
        expect(e.getHP()).toBe(expectedHP);
    });

    test('should take double damage from element entity is weak to', () => {
        const damage = 2;
        const expectedHP = e.getMaxHP() - damage * 2;
         
        e.setElement(Elements.FIRE);
        e.applyDamage(damage, Elements.WATER);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.EARTH);
        e.applyDamage(damage, Elements.FIRE);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.LIGHTNING);
        e.applyDamage(damage, Elements.EARTH);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.WATER);
        e.applyDamage(damage, Elements.LIGHTNING);
        expect(e.getHP()).toBe(expectedHP);
    });

    test('should take half damage from element entity is strong against', () => {
        const damage = 4;
        const expectedHP = e.getMaxHP() - damage / 2;

        e.setElement(Elements.WATER);
        e.applyDamage(damage, Elements.FIRE);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.FIRE);
        e.applyDamage(damage, Elements.EARTH);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.EARTH);
        e.applyDamage(damage, Elements.LIGHTNING);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();

        e.setElement(Elements.LIGHTNING);
        e.applyDamage(damage, Elements.WATER);
        expect(e.getHP()).toBe(expectedHP);

    });

    test('should take half damage when defending', () => {
        e.defend();
        const damage = 4;
        const expectedHP = e.getMaxHP() - damage / 2;

    });

    test('should take 1/4 damage when defending and strong against type', () => {
        const damage = 4;
        const expectedHP = e.getMaxHP() - damage / 4;

        e.defend();

        e.setElement(Elements.WATER);
        e.applyDamage(damage, Elements.FIRE);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();
        e.defend();
        
        e.setElement(Elements.FIRE);
        e.applyDamage(damage, Elements.EARTH);
        expect(e.getHP()).toBe(expectedHP);
        
        e.reset();
        e.defend();
        
        e.setElement(Elements.EARTH);
        e.applyDamage(damage, Elements.LIGHTNING);
        expect(e.getHP()).toBe(expectedHP);
        
        e.reset();
        e.defend();

        e.setElement(Elements.LIGHTNING);
        e.applyDamage(damage, Elements.WATER);
        expect(e.getHP()).toBe(expectedHP);
    });

    test('should take normal damage when defending and weak to type', () => {
        const damage = 10;
        const expectedHP = e.getMaxHP() - damage;

        e.defend();

        e.setElement(Elements.FIRE);
        e.applyDamage(damage, Elements.WATER);
        expect(e.getHP()).toBe(expectedHP);

        e.reset();
        e.defend();
        
        e.setElement(Elements.EARTH);
        e.applyDamage(damage, Elements.FIRE);
        expect(e.getHP()).toBe(expectedHP);
        
        e.reset();
        e.defend();
        
        e.setElement(Elements.LIGHTNING);
        e.applyDamage(damage, Elements.EARTH);
        expect(e.getHP()).toBe(expectedHP);
        
        e.reset();
        e.defend();

        e.setElement(Elements.WATER);
        e.applyDamage(damage, Elements.LIGHTNING);
        expect(e.getHP()).toBe(expectedHP);
    });

    test('should die when taking damage and HP drops to zero or less', () => {
        
        // Test 0 HP
        e.applyDamage(e.getMaxHP());
        expect(e.getHP()).toBe(0);
        expect(e.isAlive()).toBeFalsy();
        
        // Test negative HP
        e.reset()
        e.applyDamage(e.getMaxHP() + 1);
        expect(e.getHP()).toBe(-1);
        expect(e.isAlive()).toBeFalsy();
    });

});