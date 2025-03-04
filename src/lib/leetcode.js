// src/lib/leetcode.js

// Cache variables
let problemsCache = null;
let problemsMap = null;
let lastFetchTime = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds

/**
 * Get details for a specific LeetCode problem
 * @param {string|number} problemId - The LeetCode problem ID
 */
export async function getProblemDetails(problemId) {
  try {
    // Initialize or refresh cache if needed
    await initializeCache();

    // Get problem from cache (O(1) lookup)
    const problem = problemsMap.get(problemId.toString());

    if (!problem) {
      throw new Error(`Problem #${problemId} not found`);
    }

    return transformProblemData(problem);
  } catch (error) {
    console.error("Error in getProblemDetails:", error);
    throw error;
  }
}

/**
 * Initialize or refresh the problems cache
 */
async function initializeCache() {
  const shouldRefresh =
    !lastFetchTime ||
    Date.now() - lastFetchTime > CACHE_DURATION ||
    !problemsMap;

  if (shouldRefresh) {
    try {
      console.log("Refreshing LeetCode problems cache...");

      const response = await fetch(
        "https://leetcode.com/api/problems/algorithms/"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch LeetCode problems");
      }

      const data = await response.json();

      // Store the full problems array
      problemsCache = data.stat_status_pairs;

      // Create Map for O(1) lookups
      problemsMap = new Map(
        problemsCache.map((p) => [p.stat.frontend_question_id.toString(), p])
      );

      lastFetchTime = Date.now();
      console.log(`Cache refreshed with ${problemsMap.size} problems`);
    } catch (error) {
      console.error("Error initializing cache:", error);
      throw error;
    }
  }
}

/**
 * Transform raw problem data into a clean format
 * @param {Object} problem - Raw problem data from LeetCode API
 */
function transformProblemData(problem) {
  try {
    return {
      id: problem.stat.frontend_question_id,
      title: problem.stat.question__title,
      titleSlug: problem.stat.question__title_slug,
      difficulty: ["Easy", "Medium", "Hard"][problem.difficulty.level - 1],
      url: `https://leetcode.com/problems/${problem.stat.question__title_slug}/`,
      isPremium: problem.paid_only || false,
      totalAccepted: problem.stat.total_acs,
      totalSubmitted: problem.stat.total_submitted,
      acceptanceRate:
        problem.stat.total_submitted > 0
          ? (
              (problem.stat.total_acs / problem.stat.total_submitted) *
              100
            ).toFixed(1) + "%"
          : "0%",
    };
  } catch (error) {
    console.error("Error transforming problem data:", error);
    throw new Error("Failed to transform problem data");
  }
}

/**
 * Get a list of all LeetCode problems
 */
export async function getAllProblems() {
  await initializeCache();
  return Array.from(problemsMap.values()).map(transformProblemData);
}

/**
 * Search problems by title
 * @param {string} query - Search query
 */
export async function searchProblems(query) {
  await initializeCache();
  query = query.toLowerCase();

  return Array.from(problemsMap.values())
    .filter((p) => p.stat.question__title.toLowerCase().includes(query))
    .map(transformProblemData);
}

// Default export for the main function
export default getProblemDetails;
