class Dice {
  #pips;

  constructor() {
    this.#pips = 0;
  }

  roll() {
    const number = Math.floor(Math.random() * 100);
    if (number > 0 && number < 7) {
      this.#pips = number;
      return this;
    }
    return this.roll();
  }

  reset() {
    this.#pips = 0;
    return this;
  }

  getPips() {
    return this.#pips;
  }
}

class DiceGamePlayer {
  #roundScore;
  #totalScore;
  #roundPips;
  #maxDice;
  #holdingDice;

  constructor(name) {
    this.name = name;

    this.#holdingDice = [];
    this.#roundScore = 0;
    this.#totalScore = 0;
    this.#maxDice = 2;
    this.#roundPips = [];
  }

  addDiceToBowl(aDice) {
    if (this.#holdingDice.length === this.#maxDice) {
      throw new Error(
        `Maximum dice for each player is ${
          this.#maxDice
        }. No more dice will be added.`
      );
    }
    this.#holdingDice.push(aDice);
  }

  getPlayerDice() {
    return this.#holdingDice;
  }

  getRoundScore() {
    return this.#roundScore;
  }

  getRoundDicePips() {
    return this.#roundPips;
  }

  getTotalScore() {
    return this.#totalScore;
  }

  throwDice() {
    this.#roundPips = this.#holdingDice.map((dice) => dice.roll().getPips());
    this.#roundScore = this.calculateScore(this.#roundPips);
    this.#totalScore += this.#roundScore;
  }

  reset() {
    this.#roundScore = 0;
    this.#totalScore = 0;
    this.#roundPips = [];
  }

  calculateScore(dicePips) {
    // If a 1 pip found then the score is 0
    const onePip = dicePips.find((pips) => pips === 1);
    if (onePip) {
      return 0;
    }

    for (let i = 0; i < dicePips.length - 1; i++) {
      if (dicePips[i] !== dicePips[i + 1]) {
        return dicePips.reduce((acc, curr) => acc + curr, 0);
      }
    }

    // There is all same pips. Score is multiplied by 2.
    return dicePips[0] * dicePips.length * 2;
  }
}

class Game {
  #remainingRounds;
  #maxRound;

  constructor(maxRounds) {
    this.player = [];

    this.#maxRound = maxRounds;
    this.#remainingRounds = maxRounds;
  }

  getMaxRound() {
    return this.#maxRound;
  }

  getRemainingRounds() {
    return this.#remainingRounds;
  }

  addPlayer(player) {
    this.player.push(player);
  }

  throwPlayersDiceTogether() {
    if (this.#remainingRounds > 0) {
      this.#remainingRounds -= 1;
      this.player.forEach((player) => {
        player.throwDice();
      });
    } else {
      throw new Error('Game reaches max number of rounds.');
    }
  }

  reset() {
    this.#remainingRounds = this.#maxRound;
    this.player.forEach((player) => {
      player.getPlayerDice().map((dice) => dice.reset());
      player.reset();
    });
  }
}
