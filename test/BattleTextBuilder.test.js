const BattleTextBuilder = require('../BattleTextBuilder');
const Actions = require('../Actions');

describe('BattleTextBuilder', () => {

    let b;

    beforeAll(() => {
        b = new BattleTextBuilder();
    });
    
    test('should create attack text with damage and target entity', () => {
        const action = { type: Actions.ATTACK, dmg: 15, hit: true };
        const text = b.createTextForAction(action, 'You', 'Dragon');
        expect(text).toBe("You hit the Dragon for 15 damage!");
    });

    test('should create text of attack that misses', () => {
        const action = { type: Actions.ATTACK, dmg: 15, hit: false };
        const text = b.createTextForAction(action, 'You', 'Dragon');
        expect(text).toBe("You missed the Dragon!");
    });

    test('should create spell text with damage and target entity', () => {
        const action = { type: Actions.SPELL, dmg: 25, hit: true };
        const text = b.createTextForAction(action, 'You', 'Dragon');
        expect(text).toBe("Spell cast by You hits the Dragon for 25 damage!");
    });

    test('should create healed amount text', () => {
        const action = { type: Actions.HEAL, heal: 33 };
        const text = b.createTextForAction(action, 'You');
        expect(text).toBe("You healed 33 health!");
    });

    test('should create defending text', () => {
        const action = { type: Actions.DEFEND};
        const text = b.createTextForAction(action, 'You');
        expect(text).toBe("You took defensive stance!");
    });

    test('should create status text for entity with full HP and MP', () => {
        const entity = { name: "You", HP: 200, maxHP: 200, MP: 3, maxMP: 3 }
        const text = b.createStatusTextForEntity(entity);
        const expected =`You\nHP 200/200\nMP 3/3`;
        expect(text).toBe(expected);
    });

    test('should create status text for entity with HP only', () => {
        const entity = { name: "Dragon", HP: 100, maxHP: 100 };
        const text = b.createStatusTextForEntity(entity);
        const expected =`Dragon\nHP 100/100`;
        expect(text).toBe(expected);
    });

    test('should create status text for entity with not full HP and MP', () => {
        const entity = { name: "You", HP: 80, maxHP: 150, MP: 1, maxMP: 5 };
        const text = b.createStatusTextForEntity(entity);
        const expected =`You\nHP 80/150\nMP 1/5`;
        expect(text).toBe(expected);
    });

    test('should throw if invalid action', () => {
        expect(() => {
            const action = { type: 'not_a_real_action'};
            b.createTextForAction(action);
        }).toThrow("Invalid action type.");
    });

    test('should throw if action has no type', () => {
        expect(() => {
            const action = { no_type_here: 'not_a_real_action'};
            b.createTextForAction(action);
        }).toThrow("Action has no type.");
    });
});