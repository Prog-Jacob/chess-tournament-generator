export function trapezoidalIntegration(
    pdf: (x: number) => number,
    a: number,
    b: number,
    n: number = 50
): number {
    const H = (b - a) / n;
    let area = (pdf(a) + pdf(b)) / 2;

    for (let x = 1; x < n; x++) {
        area += pdf(a + x * H);
    }

    return H * area;
}
