**Session 4: Discussion About Propositional Logic**

#### Exploring Logic's Flexibility:

Session 4 delved into the realm of propositional logic, probing whether its structure could be as versatile as a chameleon or if it obediently adheres to specific forms. Following in the intellectual footsteps of Kurt Gödel, it was time to roll up the sleeves and start axiomatizing.

#### Experimentation Strategies:

With matrix multiplication simmering in the background, the focus turned to experimentation. The plan involved implementing a SAT solver with upper and lower bounds tied to matrix dimensions. The goal? Use a binary search to identify the lowest number the solver could churn out. Two implementation approaches were on the table: first, efficient axiomatization of clauses, with a nod towards Gödel's paper on the incompleteness theorem in hope it would include some general technique to convert my problem into proper form. The second idea was a stacked SAT solver, piggybacking on the output of another solver. However, the risk of a bloated search space loomed, threatening to send the solver into a divergent spiral.

#### Consulting with a Teaching Assistant:

Seeking clarity, I reached out to Eng. Zyad Shokry, a former TA at E-JUST, to chew over the nuances of propositional logic. The discussion revolved around expressing a set of clauses in various forms, such as Conjunctive Normal Form. The conclusion was enlightening – yes, it could be expressed in different forms, with compactness and speed varying based on the problem and the SAT solver type.

#### Reality Check:

As high-level concepts accumulated, the realization hit – the pursuit of anything and everything might lead to impracticality. The need for practical standards asserted itself. The video snippet proclaiming "infinitely search space" became a wake-up call, urging a shift towards pragmatic standards. This session marked a pivot from the speculative to the practical, setting a grounded tone for the remainder of the journey.

#### References:

1. [How AI Discovered a Faster Matrix Multiplication Algorithm](https://www.youtube.com/watch?v=fDAPJ7rvcUw)
2. [Gödel’s Incompleteness Theorems (Stanford Encyclopedia of Philosophy)](https://plato.stanford.edu/entries/goedel-incompleteness/)

---

[← Previous](Session03.md) | [Next →](./Session05.md)