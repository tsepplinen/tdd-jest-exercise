module.exports = class Dice {
    constructor(randomNumberGenerator = Math.random) {
        this.rng = randomNumberGenerator;
    }

    roll(min, max) {
        const range = max - min + 1;
        return Math.floor(this.rng() * range) + min;
    }
}