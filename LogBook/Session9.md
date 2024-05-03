**Session 9: Midpoint Reflection**

#### Progress Evaluation:

In this session, I took the time to evaluate the current progress of the project. From a statistical modeling perspective, I found myself in a good position and felt content about the representation of players as a skewed normal distribution. However, from the optimization and simulation point of view, I found myself lagging behind. The time complexity of implementing simulations for different formats has proven to be a challenging task.

#### Format Decisions:

After careful consideration, I decided on the three most common formats used in chess tournaments for our project. These are:

1. **Swiss format** - a one-game match.
2. **Single round elimination** - a two-game match (black and white).
3. **Round robin** - can be 1 or 2 games per match.

Each format has its own management requirements, such as generating pairings, updating standings, and setting up match-ups. Here’s a detailed comparison of the three formats:

1. **Swiss Format**:
    - **Pairings**: In a Swiss-system tournament, each competitor does not play all the other competitors. Competitors meet one-on-one in each round and are paired using a set of rules designed to ensure that each competitor plays opponents with a similar running score, but does not play the same opponent more than once. In my implementation, I would use multi-rounds Swiss format; meaning, after all players meet each other, we start the pairings over till the number of rounds is over.
    - **Rounds**: The tournament features a fixed number of rounds of competition.
    - **Qualifiers**: The qualifiers are the competitors with the highest aggregate points earned in all rounds.
2. **Single Round Elimination**:
    - **Pairings**: Unlike the Swiss system, all pairings are known from the beginning of the competition.
    - **Rounds**: The number of rounds is determined by the number of competitors, with each round halving the number of competitors.
    - **Qualifiers**: The qualifiers are the competitors remaining after all others have been eliminated.
3. **Round Robin**:
    - **Pairings**: In round-robin tournaments, each participant plays every other participant an equal number of times.
    - **Rounds**: The number of rounds is determined by the number of competitors.
    - **Qualifiers**: The qualifiers are the competitors with the highest aggregate points earned in all rounds.

Each format has its own advantages and disadvantages, and the choice of format can greatly affect the dynamics and outcome of the tournament.

#### Format Generators:

We will need generators for all three formats that we will use for generating samples. Given the number of players, the format generator should be able to decide if it can generate any formats, and if yes, generate a random format within the rules. Also, given the format, the generator should be able to determine the number of rounds of the format, and the number of qualifiers after playing the format.

#### Next Steps:

Moving forward, the focus will be on catching up on the optimization and simulation aspects of the project. The goal is to have a working simulation for all different kinds of formats by the next session.

#### References:

1. [Chess tournament](https://en.wikipedia.org/wiki/Chess_tournament#Round-robin)
2. [FIDE Handbook](https://handbook.fide.com/)

---

[← Previous](Session08.md) | [Next →](./Session10.md)