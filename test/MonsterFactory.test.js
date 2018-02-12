const MonsterFactory = require('../MonsterFactory');

describe('MonsterFactory', () => {
    
    test('should create a level 1 monster', () => {
        const monster = MonsterFactory.create(1);     
        expect(monster).toBeDefined();
        expect(monster.getLevel()).toBe(1);
    });

    test('should create a level 50 monster', () => {
        const monster = MonsterFactory.create(50);     
        expect(monster).toBeDefined();
        expect(monster.getLevel()).toBe(50);
    });

    test('should create a monster with valid element', () => {
        const monster = MonsterFactory.create(1);     
        expect(monster).toBeDefined();
        expect(monster.getElement()).toBeGreaterThanOrEqual(1);
        expect(monster.getElement()).toBeLessThanOrEqual(4);
        
    });


});