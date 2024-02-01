**Session 10: Getting Technical**

In Session 10, the focus shifted to the technical implementation of the previously conceptualized components. Leveraging TypeScript, the following classes and features were implemented:

1. **Skewed Normal Distribution Class:**

    - Properties: Mean, Standard Deviation, Skewness
    - Features: PDF, CDF, Calculate Skewness, Owen's T, Inverse CDF

2. **Player Class (Extends Skewed Normal Distribution):**

    - Properties: Name, Ratings
    - Features: Generate Random Ratings

3. **Tournament Manager Classes (Swiss, Round Robin, Single Elimination):**

    - Features: Pairings, Profiles, Winners, Losers, Round, Format
    - Actions: Generate Pairings, Match-Up, Player Lost, Player Won, Get Winners, Get Losers, Update Standings, Execute Round, Execute Tournament

4. **Tournament Generator Classes (Swiss, Round Robin, Single Elimination):**

    - Features: Generate Random Format, Can Generate Format, Get Number of Qualifiers, Get Number of Rounds

5. **Tournament Class:**

    - Orchestrates the entire tournament by iterating over each format, taking qualifiers of each format, and passing them to the next format.
    - Features: Get Tournament Results (Executes the whole tournament and returns results in winners to losers order).

6. **Utilities:**
    - Shuffle Array: Used to randomize player order for unbiased initial pairings.
    - Trapezoidal Integration: Used in the double integral of win probability and Owen's T function.

#### Next Steps:

1. **Genetic Algorithm Implementation:**

    - Develop a mechanism to generate any number of random samples.
    - Implement selection of the fittest samples.
    - Design and implement the crossover process.

2. **UI Development:**
    - Initiate the User Interface development phase.

As the project enters a critical phase, the implementation decisions made during Session 10 set the stage for the subsequent sessions. The genetic algorithm will play a pivotal role in optimizing tournament outcomes, bringing the project one step closer to its completion.

---

[← Previous](Session09.md) | [Next →](./Session11.md)