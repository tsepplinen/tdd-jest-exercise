    const Player = require('../Player');
const Config = require('../Config');
const Monster = require('../Monster');
const Actions = require('../Actions');

describe('Player', () => {
    let p;

    beforeEach(() => {
        p = new Player();
    });
    
    test('should be fully initialized', () => {
        expect(p.getLevel()).toBe(Config.PLAYER_STARTING_LEVEL);
    });
    
    test('should do attack when given command ATTACK', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const hp = monster.getHP();
        const action = p.doAction(Actions.ATTACK, monster, 100);
        expect(action.valid).toBeTruthy();
        expect(action.type).toEqual(Actions.ATTACK);
        expect(monster.getHP()).toBeLessThan(hp);
    });

    test('should miss an attack with hit roll <= 10', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const hp = monster.getHP();
        p.doAction(Actions.ATTACK, monster, 0);
        p.doAction(Actions.ATTACK, monster, 5);
        p.doAction(Actions.ATTACK, monster, 10);
        expect(monster.getHP()).toBe(hp);
    });

    test('should calculate attack damage with attack stat', () => {

        const monster = new Monster(1, '', Elements.NORMAL, false);

        p.setAttack(1);
        const lowAttack = p.doAction(Actions.ATTACK, monster, 100);
        const lowDamage = lowAttack.dmg;

        p.setAttack(100);
        const highAttack = p.doAction(Actions.ATTACK, monster, 100);
        const highDamage = highAttack.dmg;

        expect(highDamage).toBeGreaterThan(lowDamage);
    });

    test('should defend when given command DEFEND', () => {
        const action = p.doAction(Actions.DEFEND);
        expect(action.type).toEqual(Actions.DEFEND);
        expect(p.getDefending()).toBeTruthy();
    });

    test('should cast spell when given command SPELL', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const hp = monster.getHP();
        const action = p.doAction(Actions.SPELL, monster, 100);
        expect(action.valid).toBeTruthy();
        expect(action.type).toEqual(Actions.SPELL);
        expect(monster.getHP()).toBeLessThan(hp);
    });

    test('should cast a spell of the players element', () => {
        const water = new Player(Elements.WATER);
        const earth = new Player(Elements.EARTH);
        const monster = new Monster(1, '', Elements.FIRE, false);
        
        let hp = monster.getHP();
        water.doAction(3, monster, 100);
        const waterDamage = hp - monster.getHP();

        hp = monster.getHP();
        earth.doAction(3, monster, 100);
        const earthDamage = hp - monster.getHP();

        expect(waterDamage).toBeGreaterThan(earthDamage);
    });

    test('should calculate spell damage with magic stat', () => {

        const monster = new Monster(1, '', Elements.NORMAL, false);
        p.setMaxMP(1000);
        p.setMP(1000);

        p.setMagic(1);
        const lowMagic = p.doAction(Actions.SPELL, monster, 100);
        const lowDamage = lowMagic.dmg;

        p.setMagic(100);
        const highMagic = p.doAction(Actions.SPELL, monster, 100);
        const highDamage = highMagic.dmg;

        expect(highDamage).toBeGreaterThan(lowDamage);
    });
    
    test('should heal 20% when given command HEAL', () => {
        p.setHP(p.getMaxHP()/5);
        const action = p.doAction(Actions.HEAL);
        expect(action.valid).toBeTruthy();
        expect(action.type).toEqual(Actions.HEAL);
        expect(p.getHP()).toBeCloseTo(p.getMaxHP()*2/5, 0);
    });

    test('should not heal over max health', () => {
        p.doAction(Actions.HEAL);
        expect(p.getHP()).toBeLessThanOrEqual(p.getMaxHP());
    });

    test('should use 2 mana when casting a spell', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        p.doAction(Actions.SPELL, monster, 100);
        expect(p.getMP()).toBe(p.getMaxMP() - 2);
    });

    test('should use 3 mana when healing', () => {
        p.doAction(Actions.HEAL);
        expect(p.getMP()).toBe(p.getMaxMP() - 3);
    });

    test('should fail casting spell when too low mana', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const hp = monster.getHP();
        p.setMP(1);
        const action = p.doAction(Actions.SPELL, monster, 100);
        expect(action.valid).toBeFalsy();
        expect(monster.getHP()).toBe(hp);
        expect(p.getMP()).toBe(1);
    });

    test('should fail healing when too low mana', () => {
        p.setMP(2);
        p.setHP(p.getMaxHP()/5);
        const action = p.doAction(Actions.HEAL);
        expect(action.valid).toBeFalsy();
        expect(p.getHP()).toBeCloseTo(p.getMaxHP()*1/5, 0);
        expect(p.getMP()).toBe(2);
    });

    test('should fail with invalid action', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const action = p.doAction(-1, monster, 100);
        expect(action.valid).toBeFalsy();
        expect(action.message).toBeDefined();
    });

    test('should fail when no entity given if action requires it', () => {
        const attack = p.doAction(Actions.ATTACK);
        expect(attack.valid).toBeFalsy();
        expect(attack.message).toBeDefined();

        const spell = p.doAction(Actions.SPELL);
        expect(spell.valid).toBeFalsy();
        expect(spell.message).toBeDefined();
    });

    test('should regenerate 1 MP each turn', () => {
        p.setMP(0);
        p.turnStart();
        const mana = p.getMP();
        expect(mana).toBe(1);
    });

    test('should regenerate to maximum of maxMP', () => {
        p.setMP(p.getMaxMP()-1);
        p.turnStart();
        p.turnStart();
        expect(p.getMP()).toBe(p.getMaxMP());
    });

    test('should level up when given enough exp', () => {

        // Required exp should be (level - 1) * 15 + 10
        // At level 1, require (1 - 1) * 15 + 10 = 10
        // At level 2, require (2 - 1) * 15 + 10 = 25
        expect(p.getLevel()).toBe(1);

        const leveledUpToTwo = p.addExp(10);

        expect(leveledUpToTwo).toBeTruthy();
        expect(p.getLevel()).toBe(2);

        const leveledUpToThree = p.addExp(25);

        expect(leveledUpToThree).toBeTruthy();
        expect(p.getLevel()).toBe(3);

    });

    test('should not level up when given too little exp', () => {
        const leveled = p.addExp(9);
        
        expect(leveled).toBeDefined();
        expect(leveled).toBeFalsy();
        expect(p.getLevel()).toBe(1);
    });

    test('should have same current HP and MP after level up', () => {
        p.setHP(5);
        p.setMP(1);
        const leveledUp = p.addExp(10);

        expect(leveledUp).toBeTruthy();
        expect(p.getHP()).toBe(5);
        expect(p.getMP()).toBe(1);
    });

    test('should increase max HP when leveling up', () => {
       const oldHP = p.getMaxHP();
       p.addExp(10000);
       expect(oldHP).toBeLessThan(p.getMaxHP());

    });
    
    test('should increase max MP when leveling up', () => {
        const oldMP = p.getMaxMP();
       p.addExp(10000);
       p.addExp(10000);
       p.addExp(10000);
       p.addExp(10000);
       expect(oldMP).toBeLessThan(p.getMaxMP());
    });

    test('should increase attack when leveling up', () => {
        const monster = new Monster(1, '', Elements.FIRE, false);
        const attack = p.doAction(Actions.ATTACK, monster, 100);
        const oldDamage = attack.dmg;
        expect(oldDamage).toBeDefined();

        p.addExp(100);
        
        const afterLevelUp = p.doAction(Actions.ATTACK, monster, 100);
        const newDamage = afterLevelUp.dmg;
        expect(newDamage).toBeDefined();
        expect(newDamage).toBeGreaterThan(oldDamage);
    });
    
    test('should increase magic when leveling up', () => {
        p.setMaxMP(1000);
        p.setMP(1000);

        const monster = new Monster(1, '', Elements.FIRE, false);
        const attack = p.doAction(Actions.SPELL, monster, 100);
        const oldDamage = attack.dmg;
        expect(oldDamage).toBeDefined();

        p.addExp(100);

        const afterLevelUp = p.doAction(Actions.SPELL, monster, 100);
        const newDamage = afterLevelUp.dmg;
        expect(newDamage).toBeDefined();
        expect(newDamage).toBeGreaterThan(oldDamage);
    });

});