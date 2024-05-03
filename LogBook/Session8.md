**Session 8: Advancements in Statistical Modeling**

#### Delving Deeper into Advanced Probability:

In Session 8, we embark on an in-depth exploration of advanced probability within the AI Chess Tournament Generator framework. The primary focus revolves around refining the statistical modeling and optimization algorithms that serve as the backbone of the application. The pursuit of advanced probability theories and methodologies becomes pivotal to augment the precision and efficacy of tournament format calculations.

#### Choosing a Model for Players:

To analyze players’ performance in sports, we need a statistical model that reflects the nature, supports the asymmetry, and leverages the availability of the data. Gaussian distributions are prominent models that account for the random fluctuations and errors that occur in sports, such as shooting accuracy or passing success rate. However, sometimes skewed distributions, such as Poisson or negative binomial, are more suitable for data that have outliers or trends, such as the number of goals scored by a player in a season. Finally, we need widely used and supported models for sustained, rapid development and comprehensive coverage of future needs.

# All About Skewed Normal Distribution

A skewed normal distribution is a type of continuous probability distribution that generalizes the normal distribution to allow for non-zero skewness, hence, inherits all normal distribution's features and properties. Skewness is a measure of the asymmetry of a distribution, where one tail is longer than the other. A skewed normal distribution has three parameters: location, scale, and shape. The location parameter determines the center of the distribution, the scale parameter determines the width of the distribution, and the shape parameter determines the degree of skewness. In this case, location is characterized by the mean ($\mu$), scale by the standard deviation ($\sigma$), and shape by a custom skewness ($\alpha$) parameter. Skewness defines the direction and degree of asymmetry in the distribution. The following features and equations will be incorporated into the program's workflow.

## Skewness Parameter ($\alpha$)

The skewness parameter ($\alpha$) determines the direction and degree of skewness in the distribution. Positive values result in right-skewed distributions, while negative values lead to left-skewed distributions. Higher absolute values of $\alpha$ indicate more pronounced skewness. The skewness function, designed to prioritize recent matches would be:

$$\alpha = \sum_{i = 1}^{n} \frac{ratings \Delta_i \times{i}}{n}$$

Given the significant impact of skewness on tournament results, further exploration of this aspect is crucial.

## Probability Density Function (PDF)

The probability density function (PDF) of the skewed normal distribution is expressed as:

$$f(x; \alpha, \mu, \sigma) = \frac{2}{\sigma} \phi\left(\frac{x - \mu}{\sigma}\right) \Phi\left(\alpha \frac{x - \mu}{\sigma}\right)$$

Where:

-   $\phi$ is the standard normal PDF.
-   $\Phi$ is the standard normal CDF.
-   $\alpha$ is the skewness parameter.
-   $\sigma$ is the standard deviation.
-   $\mu$ is the mean.

The PDF function is employed to calculate the win probability of one player over another.

## Cumulative Distribution Function (CDF)

The cumulative distribution function (CDF) of the skewed normal distribution is defined by:

$$F(x; \alpha, \mu, \sigma) = \Phi\left(\frac{x - \xi}{\omega}\right) - 2T\left(\frac{x - \xi}{\omega}, \alpha\right)$$

Where:

-   T is Owen's T function, denoted by: $$T(h, a) = \frac{1}{2\pi} \int_0^a e^{-\frac{1}{2}h^2(1 + t^2)} \,dt$$
    The CDF is utilized in plotting players' data and implementing an inverse CDF function, which maps probability to value.

## Win Probability Calculation

The win probability calculation for Player A over Player B is articulated through the joint probability distribution of their ratings:

$$P(\text{Player A wins}) = \int_{-\infty}^{\infty} \int_{-\infty}^{y} f_X(x) \cdot f_Y(y) \,dx \,dy$$

Where:

-   $f_X(x)$ and $f_Y(y)$ are the PDFs of Player A and Player B, respectively.

This integral encapsulates the probability of Player A's rating surpassing that of Player B, capturing the win probability.

## Inverse CDF

An implemented function takes cumulative probability and returns the corresponding ELO Rating of the player. Initially attempting Newton's bisection method, Binary Search proved more practical, considering the monotonic nature of the CDF. This function is integral in narrowing the ELO range, focusing on the range invCDF(0.001) to invCDF(0.999) instead of the entire spectrum.

## Trapezoidal Integration

Given the challenge of symbolic integration, the trapezoidal method is employed. The double integration involves 25 trapezoids with 10 in the inner integral. Rigorous testing yielded a worst-case difference of less than 2.5%, ensuring suitability for the intended purpose. For Owen's T function, crucial in our calculations, 10 trapezoids in its integral proved optimal, with minimal impact on accuracy and negligible error propagation concerns.

#### References:

1. [Skew normal distribution](https://en.wikipedia.org/wiki/Skew_normal_distribution)
2. [Owen's T function](https://en.wikipedia.org/wiki/Owen%27s_T_function)

---

[← Previous](Session07.md) | [Next →](./Session09.md)