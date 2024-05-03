**Session 11: Optimization Algorithms**

In this session, I focused on **implementation** and addressing **practical limitations** of my project. I also faced some challenges such as generating the first generation of the population and performing the crossover operation.

#### Genetic Algorithms:

I made a clear decision not to gamble with other optimization algorithms other than **Genetic Algorithms** (GAs). GAs are a type of evolutionary computation that mimic the natural process of evolution to find optimal solutions for a given problem. GAs are composed of four main steps: initialization, selection, crossover, and mutation.

I was certain there should be a better algorithm for this problem’s purpose, such as **Simulated Annealing**, **Particle Swarm Optimization**, or **Ant Colony Optimization**. However, these algorithms tend to be complicated and would require some time studying and understanding in order to be able to:

1. Choose what’s best for my purpose.
2. Reflect its implementation on my problem.

So I decided to invest this time on something I experienced before, which is GAs. I knew there would be challenges in generating random samples and especially the crossover.

#### Initialization:

For generating the initial population of tournaments, I used a **recursive backtracking** algorithm that halts in one of three cases:

-   When the number of rounds exceeds the required number, returning `None`.
-   When the number of rounds equals the required number, returning the valid tournament.
-   When the number of members of the population is greater than or equal to the required population size, returning the population.

This wasn’t the best thing, but it just worked. Since successors are generated randomly, it’s hard to determine the time complexity of this program.

#### Selection:

For selecting the fittest tournaments, I used a straightforward approach. I iterated over the tournaments population, simulated the tournament and got the results back. I compared the results against the desired standings with **mean squared error** (MSE) loss function and picked the least `P` tournaments in error, where `P` is the population size. The MSE loss function is defined as:

$$\text{MSE} = \sum_{i=1}^n (y_i - \hat{y}_i)^2$$

where $y_i$ is the actual standing of the $i$-th player,$\hat{y}_i$ is the expected standing of the $i$-th player, and $n$ is the number of players.

#### Crossover:

For the crossover operation, I looked for a single point where I can split the two parents and mix these halves. The point of split was as such: a point $[r, p]$ in parent 1 and parent 2 that after the $i$-th format in the tournament, we will be at round $r$ and the remaining number of qualifiers is $p$. I then sorted these crossovers such that $i + j$ is the least, where $i$ and $j$ are the indices of parent 1 and parent 2, and selected the best $P$ children.

#### Genetic Algorithm Class:

The genetic algorithm class has these properties:

-   `players`: a list of players’ information, such as results and distribution.
-   `expected_results`: a list of expected standings of the players.
-   `population_size`: the size of the population of tournaments.
-   `number_of_rounds`: the number of rounds in each tournament.
-   `current_children`: the current generation of tournaments.
-   `fittest`: the current generation after evolving.

The genetic algorithm class has these features:

-   `select_fittest()`: a method that selects the fittest tournaments from the current generation based on the MSE loss function.
-   `crossover()`: a method that performs the crossover operation on the selected tournaments and generates a new generation of tournaments.
-   `advance_generation_by(n)`: a method that advances the generation bynsteps, calling the `select_fittest()` and `crossover()` methods in each step.
-   `preprocess_tournament(tournament)`: a helper method that preprocesses a tournament by assigning colors and seeds to the players.
-   `generate_samples()`: a helper method that generates the initial population of tournaments using the recursive backtracking algorithm.

#### Next Steps:

Execution time of the program is not reasonable, yet. Also, it's still buggy and often raises undefined behavior. I should finalize these tweaks before proceeding with the UI.

---

[← Previous](Session10.md) | [Next →](./Session12.md)