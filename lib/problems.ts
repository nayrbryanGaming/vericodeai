// API_KEY: GET /api/problems?company=&difficulty=&status=&topic= — returns: Problem[]
// API_KEY: GET /api/problems/{id} — returns: Problem
// Static seed data for the Practice module (frontend MVP). Swap for the API above when ready.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type ProblemStatus = "solved" | "attempted" | "unsolved";

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  companies: string[];
  acceptance: string;
  status: ProblemStatus;
  statement: string;
  examples: ProblemExample[];
  constraints: string[];
  hint: string;
  starter: Record<string, string>;
}

export const LANGUAGES = ["python", "javascript", "java", "cpp"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  cpp: "C++",
};

export const COMPANIES = ["Google", "Amazon", "Microsoft", "Meta", "Adobe", "TCS", "Infosys", "Zoho"];
export const TOPICS = ["All", "Arrays", "Strings", "Linked List", "Math", "DP", "Trees", "Hash Table"];

const twoSumStarter: Record<string, string> = {
  python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Write your solution here\n        pass\n`,
  javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n  // Write your solution here\n};\n`,
  java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}\n`,
  cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};\n`,
};

function genericStarter(fn: string): Record<string, string> {
  return {
    python: `class Solution:\n    def ${fn}(self):\n        # Write your solution here\n        pass\n`,
    javascript: `var ${fn} = function() {\n  // Write your solution here\n};\n`,
    java: `class Solution {\n    public void ${fn}() {\n        // Write your solution here\n    }\n}\n`,
    cpp: `class Solution {\npublic:\n    void ${fn}() {\n        // Write your solution here\n    }\n};\n`,
  };
}

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    companies: ["Google", "Amazon", "Microsoft", "Adobe"],
    acceptance: "49.2%",
    status: "unsolved",
    statement:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] == 9, so we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
    hint: "Use a hash map to store each value's index as you iterate. For each number, check if target - number already exists in the map.",
    starter: twoSumStarter,
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    companies: ["Microsoft", "Amazon", "Meta"],
    acceptance: "40.1%",
    status: "unsolved",
    statement:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each node contains a single digit. Add the two numbers and return the sum as a linked list.",
    examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }],
    constraints: ["The number of nodes in each list is in the range [1, 100].", "0 <= Node.val <= 9"],
    hint: "Walk both lists together carrying any overflow. Don't forget a trailing carry node at the end.",
    starter: genericStarter("addTwoNumbers"),
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Strings",
    companies: ["Amazon", "Google", "Adobe", "Zoho"],
    acceptance: "33.8%",
    status: "unsolved",
    statement: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    hint: "Sliding window: expand the right edge, and when you hit a duplicate, shrink the left edge past the previous occurrence.",
    starter: genericStarter("lengthOfLongestSubstring"),
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Arrays",
    companies: ["Google", "Microsoft", "Meta"],
    acceptance: "36.6%",
    status: "unsolved",
    statement:
      "Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "merged = [1,2,3], median is 2." }],
    constraints: ["0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000"],
    hint: "Binary search the partition point on the smaller array so that left halves of both arrays fill exactly half the total.",
    starter: genericStarter("findMedianSortedArrays"),
  },
  {
    id: 5,
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Strings",
    companies: ["Amazon", "Microsoft", "TCS", "Infosys"],
    acceptance: "40.7%",
    status: "unsolved",
    statement:
      "Given a string `s` containing just the characters '()[]{}', determine if the input string is valid. Brackets must be closed in the correct order and every closing bracket matches an open bracket of the same type.",
    examples: [
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    hint: "Push opening brackets on a stack; on a closing bracket, pop and check it matches. The stack must be empty at the end.",
    starter: genericStarter("isValid"),
  },
  {
    id: 6,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "DP",
    companies: ["Adobe", "Amazon", "Zoho"],
    acceptance: "52.1%",
    status: "unsolved",
    statement:
      "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1+1, or 2." },
      { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, 2+1." },
    ],
    constraints: ["1 <= n <= 45"],
    hint: "This is Fibonacci: ways(n) = ways(n-1) + ways(n-2). Iterate bottom-up with two variables.",
    starter: genericStarter("climbStairs"),
  },
  {
    id: 7,
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Arrays",
    companies: ["Microsoft", "Amazon", "Google", "Meta"],
    acceptance: "50.3%",
    status: "unsolved",
    statement: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "[4,-1,2,1] has the largest sum 6." }],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hint: "Kadane's algorithm: keep a running sum, reset it to the current element whenever it drops below the element itself.",
    starter: genericStarter("maxSubArray"),
  },
  {
    id: 8,
    title: "Binary Tree Inorder Traversal",
    difficulty: "Easy",
    category: "Trees",
    companies: ["Microsoft", "Adobe"],
    acceptance: "76.4%",
    status: "unsolved",
    statement: "Given the `root` of a binary tree, return the inorder traversal of its nodes' values.",
    examples: [{ input: "root = [1,null,2,3]", output: "[1,3,2]" }],
    constraints: ["The number of nodes is in the range [0, 100].", "-100 <= Node.val <= 100"],
    hint: "Recurse left, visit node, recurse right. Or use an explicit stack for the iterative version.",
    starter: genericStarter("inorderTraversal"),
  },
  {
    id: 9,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Hash Table",
    companies: ["Amazon", "Google", "Zoho"],
    acceptance: "67.2%",
    status: "unsolved",
    statement:
      "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }],
    constraints: ["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100"],
    hint: "Use the sorted characters (or a 26-letter count) of each word as a hash-map key to bucket anagrams together.",
    starter: genericStarter("groupAnagrams"),
  },
  {
    id: 10,
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List",
    companies: ["Google", "Amazon", "Meta", "Microsoft"],
    acceptance: "48.9%",
    status: "unsolved",
    statement:
      "You are given an array of `k` linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    examples: [{ input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
    constraints: ["k == lists.length", "0 <= k <= 10^4", "The total number of nodes will not exceed 10^4."],
    hint: "Use a min-heap of the current head of each list, or merge the lists pairwise in O(N log k).",
    starter: genericStarter("mergeKLists"),
  },
];

export function getProblem(id: number): Problem | undefined {
  return problems.find((p) => p.id === id);
}
