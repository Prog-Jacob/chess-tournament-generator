**Session 12: Fine-Tuning Base Models**

In this session, I focused on reflecting on previous session experiences and enhancing the base architecture. I also worked on finalizing implementations, fixing bugs, and running tests.

#### Tournament Simulation:

One of the main challenges I faced in this session was the time complexity of the tournament simulation. The tournament simulation is supposed to be called in every generation $G$, for each member of the population $P$. The tournament simulation would be done for each round $R$, between at maximum $N$ Players. The match up of two players depends on the time complexity of the win probability function, which I tweaked to optimize for accuracy and execution time. I made it 25 iterations for the outer integral and 10 for the inner. That brings the time complexity to $P \times R \times N \times 25 \times 10$ in each generation. This was too much for my computational resources.
To overcome this problem, I created a universal manager class, which creates a map from each player to every other player in the tournament with the win probability of Player 1 over Player 2. This creates a lookup table of $O(1)$ for the matchups. This reduces the time complexity to $P \times R \times N$. This brings the time complexity two orders of magnitudes down, and shifts the overhead of matchups at the beginning of the program execution of $N^2 \times O(\text{matchup})$, where $O(\text{matchup})$ is $25 \times 10 = 250$ for now.

#### Random Samples:

Another task I accomplished in this session was generating random samples for the initial population and the crossover operation. I optimized the naive recursive backtracking algorithm to add memoization (Dynamic Programming). This cache mechanism helped not only terminate early and efficiently, but also, have many cache lookups that brought the time complexity to maximum of $O(R \times N)$.

#### Next Steps:

While the project is coming at end, it's time to implement a graphical user interface for the ease of use and testing. I intend to create a home page in which user can choose to input their data, use random data, or use predefined datasets. There should be also, a page in which user customize their tournament and preview the players representation. Finally, a results page in which user can play around with generations, check out suggested tournament, and standings after executing this tournament.

---

[← Previous](Session11.md) | [Next →](./Session13.md)