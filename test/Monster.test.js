const Monster = require('../Monster');

describe('Monster', () => {

    let t;
    let m;

    test('should attack', () => {
        m = new Monster(1, "Dummy", 1,  false);
        t = new Monster(1, "Target", 2, false);
        const action = m.fight(t, 100);
        expect(action.type).toBe('attack');
    });
    
    test('should cast spell', () => {
        m = new Monster(1, "Dummy", 1,  true);
        t = new Monster(1, "Target", 2, false);
        const action = m.fight(t, 100);
        expect(action.type).toBe('spell');
    });

    test('should miss attack if rolling low', () => {
        m = new Monster(1, "Dummy", 1,  false);
        t = new Monster(1, "Target", 2, false);
        const action = m.fight(t, 10);
        expect(action.hit).toBeDefined();
        expect(action.hit).toBeFalsy();
    });

    test('should use attack stat to calculate damage', () => {
        m = new Monster(1, "Dummy", 1,  false);
        t = new Monster(1, "Target", 1, false);

        m.setAttack(1);
        const lowAttack = m.fight(t, 100);
        const lowDamage = lowAttack.dmg;

        m.setAttack(100);
        const highAttack = m.fight(t, 100);
        const highDamage = highAttack.dmg;

        expect(highDamage).toBeGreaterThan(lowDamage);
    });

    test('should use magic stat to calculate magic damage', () => {
        m = new Monster(1, "Dummy", 1,  true);
        t = new Monster(1, "Target", 1, false);

        m.setMagic(1);
        const lowMagic = m.fight(t, 100);
        const lowDamage = lowMagic.dmg;

        m.setMagic(100);
        const highMagic = m.fight(t, 100);
        const highDamage = highMagic.dmg;

        expect(highDamage).toBeGreaterThan(lowDamage);
    });

    test('should give exp as reward determined by level', () => {
        m1 = new Monster(1, "Dummy", 1,  false);
        m2 = new Monster(20, "Dummy", 1,  false);
        const lowReward = m1.getReward();
        const highReward = m2.getReward();

        expect(lowReward.exp).toBeDefined();
        expect(highReward.exp).toBeDefined();
        expect(lowReward.exp).toBeLessThan(highReward.exp);
    });
});