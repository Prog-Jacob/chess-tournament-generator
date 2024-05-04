**Session 6: Kickoff of the Second Journey**

#### Revisiting Goals and Getting Started (Over):

As the second leg of the PBL journey unfolds, Session 6 marks a strategic reset. It's about revisiting initial goals with a fresh perspective and gearing up for a new venture. The decision to shift focus from matrix multiplication challenges to an AI Chess Tournament Generator introduces a renewed sense of purpose.

#### Establishing Project Goals, Planning, and Initial Progress:

The AI Chess Tournament Generator is conceptualized as a React.js application fueled by statistical modeling and optimization algorithms. The primary objective is to streamline the creation of chess tournaments by employing a sophisticated blend of skewed normal distribution and genetic algorithms. The application's goals include calculating the probabilistically best tournament format based on players' recent ratings and the desired number of rounds. Two primary modes, Fair and Exciting, aim to maximize either expected results or excitement. Features include support for three common chess formats (Swiss, Round Robin, Single Elimination Round).

#### Program's Framework:

Given a set of players recent ratings and number of rounds needed for you tournament. We calculate a model for each player (for example, normal distribution). Then, we initialize a genetic algorithm as follows:

-   For first generation, generate `N` tournaments with mix of unique, random formats that sums up to `K` rounds.
-   For selecting the fittest, we simulate all the `N` tournaments get the results, and calculate the error value using `MSE` against the expected results we obtained from the players models.
-   For crossings over, we find a point that two parents can overlap at point `[Round, Remaining Players]`.
-   We introduce new generations if the number of population is decaying over time.

#### References:

1. [Chess tournament](https://en.wikipedia.org/wiki/Chess_tournament#Formats)
2. [Skew normal distribution](https://en.wikipedia.org/wiki/Skew_normal_distribution)

---

[← Previous](Session05.md) | [Next →](./Session07.md)