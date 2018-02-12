const Dice = require('../Dice.js');

let mockRandomValue = 0.123456;
const mockRng = () => { return mockRandomValue };
const dice = new Dice(mockRng);


describe('Dice', () => {

    it('rolls between given min and max', () => {
        const min = 1;
        const max = 100;
        const roll = dice.roll(min, max);
        expect(roll).toBeGreaterThanOrEqual(min);
        expect(roll).toBeLessThanOrEqual(max);
    });

    it('rolls min value correctly', () => {
        mockRandomValue = 0;
        expect(dice.roll(0,10)).toBe(0);
    });

    it('rolls max value correctly', () => {
        mockRandomValue = 0.99999999999999;
        expect(dice.roll(0,10)).toBe(10);
    });
})