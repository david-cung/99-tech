/**
 * Implementation A: Mathematical Formula (Gauss's Formula)
 * Uses the closed-form formula: n * (n + 1) / 2
 *
 * Time Complexity: O(1) - constant time
 * Space Complexity: O(1) - constant space
 *
 * This is the most efficient approach as it computes the result
 * directly without any iteration or recursion.
 */
function sum_to_n_a(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Implementation B: Iterative Approach
 * Uses a simple loop to accumulate the sum
 *
 * Time Complexity: O(n) - linear time, iterates n times
 * Space Complexity: O(1) - constant space, only uses one variable
 *
 * Straightforward and readable, but less efficient than the formula.
 * Good for understanding the concept of summation.
 */
function sum_to_n_b(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Implementation C: Recursive Approach
 * Breaks down the problem into smaller subproblems
 *
 * Time Complexity: O(n) - linear time, makes n recursive calls
 * Space Complexity: O(n) - linear space due to call stack
 *
 * Elegant and demonstrates recursive thinking, but least efficient
 * due to function call overhead and stack space usage. Risk of
 * stack overflow for very large n values.
 */
function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}
