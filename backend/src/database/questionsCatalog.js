"use strict";

/**
 * CareerCoach AI - Question Catalog
 * Comprehensive engineering placement interview questions across:
 * - HR
 * - Self-Introduction
 * - Communication & Behavioral (STAR)
 * - Aptitude (Quantitative & Logical)
 * - Programming & DSA
 * - Web Development
 * - Database & SQL
 * - Networking, OS & Software Engineering
 * - Department-Specific (Mechanical, Biomedical, ECE, EEE, Civil, AI & DS)
 * - Career-Role-Specific (Full-Stack, Data Science, AI/ML, Cloud, Security, Embedded, etc.)
 */

const questionsCatalog = [
  // ── HR & Self-Introduction ──────────────────────────────────
  {
    id: "hr_intro_1",
    category: "Self-Introduction",
    interview_type: "hr",
    department_id: "all",
    role_id: "all",
    difficulty: "easy",
    question_text: "Walk me through your resume. Introduce yourself, your academic background, core projects, and why you are interested in this career path.",
    reference_answer: "Start with your name, degree, and university. Briefly highlight 1-2 major technical projects and the real-world problem they solved. Mention your primary technical stack and demonstrate how your passion aligns with the company's engineering goals in 90-120 seconds.",
    evaluation_rubric: "Evaluate conciseness, structured flow (Education -> Projects -> Skills -> Career Goal), confidence, and relevance to engineering placement."
  },
  {
    id: "hr_why_company_2",
    category: "HR Interview",
    interview_type: "hr",
    department_id: "all",
    role_id: "all",
    difficulty: "easy",
    question_text: "Why do you want to join our company as a graduate engineer, and what sets you apart from other candidates with similar grades?",
    reference_answer: "Demonstrate concrete knowledge of the company's product, culture, or recent technological achievements. Emphasize not just grades, but hands-on problem solving, consistency, ability to learn fast, and ownership demonstrated through practical engineering projects.",
    evaluation_rubric: "Look for specific company alignment, self-awareness, unique value proposition, and avoidance of generic flattery."
  },
  {
    id: "hr_conflict_3",
    category: "Communication & Behavioral",
    interview_type: "behavioral",
    department_id: "all",
    role_id: "all",
    difficulty: "medium",
    question_text: "Describe a situation during a college team project where you had a disagreement with a team member on technical direction. How did you handle it?",
    reference_answer: "Use the STAR method: Situation (project context), Task (what needed deciding), Action (how you organized an objective discussion, evaluated trade-offs or ran small tests rather than arguing emotionally), Result (project completed successfully, mutual respect preserved).",
    evaluation_rubric: "Check for STAR structure, emotional intelligence, data-driven decision making, and constructive team dynamics."
  },
  {
    id: "hr_failure_4",
    category: "Communication & Behavioral",
    interview_type: "behavioral",
    department_id: "all",
    role_id: "all",
    difficulty: "medium",
    question_text: "Tell me about a time an engineering project or exam did not go as planned. What was the mistake and what did you learn from it?",
    reference_answer: "Honestly acknowledge the shortfall without blaming others. Explain the root cause analysis you performed, the immediate corrective action taken, and the systemic lesson or preventive habit you developed for future projects.",
    evaluation_rubric: "Assess accountability, resilience, growth mindset, and concrete takeaways rather than defensive rationalizations."
  },

  // ── Aptitude & Logical Reasoning ────────────────────────────
  {
    id: "apt_prob_1",
    category: "Aptitude & Reasoning",
    interview_type: "aptitude",
    department_id: "all",
    role_id: "all",
    difficulty: "medium",
    question_text: "A box contains 5 red balls, 4 blue balls, and 3 green balls. If 2 balls are drawn at random without replacement, what is the probability that both balls are of the same color?",
    reference_answer: "Total balls = 12. Total ways to choose 2 = 12C2 = (12*11)/2 = 66.\nWays to pick 2 Red = 5C2 = 10.\nWays to pick 2 Blue = 4C2 = 6.\nWays to pick 2 Green = 3C2 = 3.\nTotal favorable ways = 10 + 6 + 3 = 19.\nProbability = 19/66 (approx. 28.79%).",
    evaluation_rubric: "Look for correct total outcomes (66), correct individual color combinations, and final fraction 19/66 with clear step-by-step arithmetic."
  },
  {
    id: "apt_work_2",
    category: "Aptitude & Reasoning",
    interview_type: "aptitude",
    department_id: "all",
    role_id: "all",
    difficulty: "easy",
    question_text: "Pipe A can fill a tank in 6 hours, while Pipe B can fill it in 8 hours. If both pipes are opened simultaneously, how long will it take to fill the tank completely?",
    reference_answer: "Rate of Pipe A = 1/6 tank/hour.\nRate of Pipe B = 1/8 tank/hour.\nCombined rate = 1/6 + 1/8 = 4/24 + 3/24 = 7/24 tank/hour.\nTime required = 24/7 hours = 3 hours 25 minutes 43 seconds (approx 3.43 hours).",
    evaluation_rubric: "Correct use of reciprocal work rates, finding LCM 24, and final answer 24/7 hours."
  },

  // ── Programming & Data Structures (DSA) ──────────────────────
  {
    id: "dsa_array_1",
    category: "Programming & DSA",
    interview_type: "technical",
    department_id: "cse",
    role_id: "software-developer",
    difficulty: "easy",
    question_text: "Explain how you would solve the 'Two Sum' problem in O(n) time complexity. What data structure would you use, and what is the space-time trade-off?",
    reference_answer: "Use a Hash Map (or Hash Table). As we iterate through the array at index i with value x, calculate complement = target - x. If complement exists in the map, return indices [map[complement], i]. Otherwise, store map[x] = i. Time complexity is O(n) because average hash map lookups are O(1). Space complexity is O(n) to store up to n elements.",
    evaluation_rubric: "Must mention Hash Map, target - current complement calculation, single pass O(n) time, and O(n) auxiliary space complexity."
  },
  {
    id: "dsa_tree_2",
    category: "Programming & DSA",
    interview_type: "technical",
    department_id: "cse",
    role_id: "software-developer",
    difficulty: "medium",
    question_text: "How do you detect if a singly linked list contains a cycle? Explain Floyd's Cycle Detection algorithm (Tortoise and Hare) and its complexities.",
    reference_answer: "Initialize two pointers: slow moving 1 step at a time, and fast moving 2 steps at a time from head. If there is no cycle, fast or fast.next will reach null (end of list). If there is a cycle, fast will eventually lap and meet slow inside the cycle. Time complexity is O(n) and auxiliary space is O(1) as no extra memory or set is allocated.",
    evaluation_rubric: "Explanation of two pointer speeds (1x and 2x), convergence condition (slow == fast), null check termination, O(n) time and O(1) space."
  },
  {
    id: "dsa_dp_3",
    category: "Programming & DSA",
    interview_type: "technical",
    department_id: "cse",
    role_id: "software-developer",
    difficulty: "hard",
    question_text: "Explain the difference between Dynamic Programming and Divide & Conquer. What are the two essential characteristics a problem must satisfy to be solvable via Dynamic Programming?",
    reference_answer: "Both break a problem into subproblems. Divide & Conquer solves independent, non-overlapping subproblems (e.g. Merge Sort). Dynamic Programming applies when subproblems overlap and are recomputed repeatedly (e.g. Fibonacci, Knapsack). The two required properties are: 1) Optimal Substructure (optimal solution to the problem incorporates optimal solutions to subproblems), and 2) Overlapping Subproblems.",
    evaluation_rubric: "Must distinguish non-overlapping vs overlapping subproblems, define Optimal Substructure and Overlapping Subproblems clearly, and give relevant examples."
  },

  // ── Web Development ─────────────────────────────────────────
  {
    id: "web_react_1",
    category: "Web Development",
    interview_type: "technical",
    department_id: "cse",
    role_id: "frontend-developer",
    difficulty: "medium",
    question_text: "Explain how React's Virtual DOM works and what happens during the reconciliation phase. Why are unique 'key' props necessary in lists?",
    reference_answer: "The Virtual DOM is an in-memory representation of real DOM nodes. When state changes, React creates a new VDOM tree and diffs it with the previous VDOM tree using heuristic reconciliation algorithms. Only the minimal calculated diff is batched and applied to the real browser DOM. 'key' props provide stable element identities across renders, preventing React from recreating unchanged DOM elements when items are reordered, inserted, or removed.",
    evaluation_rubric: "Must explain in-memory VDOM representation, diffing algorithm, batched real DOM mutations, and how keys preserve component identity and state."
  },
  {
    id: "web_jwt_cors_2",
    category: "Web Development",
    interview_type: "technical",
    department_id: "it",
    role_id: "backend-developer",
    difficulty: "medium",
    question_text: "Explain what CORS (Cross-Origin Resource Sharing) is, how the preflight OPTIONS request works, and why JWTs should typically be stored in HttpOnly cookies rather than localStorage.",
    reference_answer: "CORS is a browser security mechanism enforcing Same-Origin Policy. When making cross-origin requests with non-simple methods (PUT, DELETE) or custom headers, the browser sends an OPTIONS preflight request to verify allowed origins, methods, and headers. Storing JWTs in localStorage exposes them to XSS attacks (malicious scripts can read window.localStorage). Storing them in HttpOnly cookies prevents JavaScript access entirely, protecting session tokens from XSS theft.",
    evaluation_rubric: "Explanation of Same-Origin Policy, preflight OPTIONS, XSS vulnerability in localStorage, and HttpOnly cookie security benefits."
  },

  // ── Database & SQL ──────────────────────────────────────────
  {
    id: "db_acid_1",
    category: "Database & SQL",
    interview_type: "technical",
    department_id: "cse",
    role_id: "backend-developer",
    difficulty: "easy",
    question_text: "What are ACID properties in Relational Database Management Systems? Provide a brief real-world banking example explaining why each property matters.",
    reference_answer: "A = Atomicity (all-or-nothing: if money is debited from account A, it must be credited to B; if it fails midway, rollback completely). C = Consistency (database transitions from one valid state to another, maintaining constraints like account balances >= 0). I = Isolation (concurrent transactions execute independently without dirty reads). D = Durability (once committed, changes persist even in system power failure).",
    evaluation_rubric: "Clear definition of Atomicity, Consistency, Isolation, and Durability illustrated with an end-to-end transaction example."
  },
  {
    id: "db_query_2",
    category: "Database & SQL",
    interview_type: "technical",
    department_id: "it",
    role_id: "data-analyst",
    difficulty: "medium",
    question_text: "Write an SQL query to find the second highest salary from an Employee table (id, name, salary). Explain how you handle ties or when fewer than two employees exist.",
    reference_answer: "Standard query: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); Or using window functions: SELECT salary FROM (SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank FROM Employee) WHERE rank = 2 LIMIT 1. DENSE_RANK correctly handles duplicate top salaries, and returning NULL handles tables with only 1 employee.",
    evaluation_rubric: "Correct SQL syntax using subquery with MAX or DENSE_RANK, awareness of duplicate salary handling and edge cases."
  },

  // ── Networking, OS & System Design ──────────────────────────
  {
    id: "os_process_thread_1",
    category: "Networking, OS & Systems",
    interview_type: "technical",
    department_id: "cse",
    role_id: "software-developer",
    difficulty: "easy",
    question_text: "What is the primary difference between a Process and a Thread? How do they differ in terms of memory space, context switching overhead, and communication?",
    reference_answer: "A Process is an executing instance of a program with its own independent address space (code, data, heap, file descriptors). A Thread is a lightweight subunit of execution within a process, sharing the process's heap and address space while having its own stack, PC, and registers. Context switching between threads is faster because memory mappings remain unchanged. Processes communicate via IPC (pipes, sockets, shared memory), while threads communicate via shared memory variables requiring synchronization (mutexes/semaphores).",
    evaluation_rubric: "Contrasting memory isolation vs shared memory, stack/register differences, context switch overhead comparison, and IPC vs thread synchronization."
  },
  {
    id: "net_tcp_udp_2",
    category: "Networking, OS & Systems",
    interview_type: "technical",
    department_id: "it",
    role_id: "cloud-engineer",
    difficulty: "medium",
    question_text: "Compare TCP and UDP protocols. Detail the 3-way handshake in TCP, and explain why video streaming or gaming often chooses UDP over TCP.",
    reference_answer: "TCP is connection-oriented, reliable, guarantees ordered delivery, and includes flow/congestion control via ACKs and retransmissions. 3-Way Handshake: 1) Client sends SYN, 2) Server replies SYN-ACK, 3) Client sends ACK. UDP is connectionless, lightweight, and unordered with no retransmissions. Video calls and gaming prioritize low latency over 100% packet reliability, where a dropped frame is acceptable but buffering delays are not.",
    evaluation_rubric: "SYN, SYN-ACK, ACK sequence clearly explained; comparison of reliability vs overhead; real-world latency trade-off justification for UDP."
  },

  // ── Department: Mechanical Engineering ──────────────────────
  {
    id: "dept_mech_1",
    category: "Mechanical Engineering",
    interview_type: "technical",
    department_id: "mech",
    role_id: "mechanical-design",
    difficulty: "medium",
    question_text: "Explain the four processes of the ideal Carnot Cycle on a P-V and T-s diagram. Why is 100% thermal efficiency theoretically impossible for any heat engine operating between two finite temperatures?",
    reference_answer: "The 4 processes are: 1) Reversible isothermal heat addition at high temp TH, 2) Reversible adiabatic (isentropic) expansion, 3) Reversible isothermal heat rejection at low temp TL, 4) Reversible adiabatic compression back to initial state. Carnot efficiency = 1 - (TL/TH). 100% efficiency requires TL = 0 Kelvin (absolute zero, unattainable by 3rd Law of Thermodynamics) or TH = infinity. The 2nd Law (Kelvin-Planck statement) dictates that no engine can convert 100% of absorbed heat into work without rejecting heat to a sink.",
    evaluation_rubric: "Identification of all 4 processes (2 isothermal, 2 adiabatic), Carnot formula, Second Law of Thermodynamics (Kelvin-Planck statement), and impossibility of absolute zero sink."
  },
  {
    id: "dept_mech_2",
    category: "Mechanical Engineering",
    interview_type: "technical",
    department_id: "mech",
    role_id: "mechanical-design",
    difficulty: "easy",
    question_text: "Explain the engineering stress-strain curve for a ductile material like mild steel. Clearly define proportional limit, yield strength, ultimate tensile strength (UTS), and fracture point.",
    reference_answer: "Stress = Force/Original Area; Strain = Change in Length/Original Length. Key points: 1) Proportional Limit (Hooke's Law holds, linear E), 2) Elastic Limit (returns to original dimensions upon load removal), 3) Yield Point (plastic deformation begins without load increase), 4) Ultimate Tensile Strength (maximum engineering stress the material withstands before necking), 5) Fracture Point (material separates). Mild steel exhibits distinct upper and lower yield points.",
    evaluation_rubric: "Correct sequence of points on stress-strain curve, definitions of Hooke's law, elastic vs plastic deformation, UTS, necking, and ductile fracture."
  },

  // ── Department: Biomedical Engineering ──────────────────────
  {
    id: "dept_biomed_1",
    category: "Biomedical Engineering",
    interview_type: "technical",
    department_id: "biomedical",
    role_id: "biomedical-engineer",
    difficulty: "medium",
    question_text: "Explain the electrophysiology of the standard ECG signal. What do the P-wave, QRS complex, and T-wave represent, and what engineering filtering techniques are used to eliminate 50Hz/60Hz power-line interference?",
    reference_answer: "P-wave = Atrial depolarization. QRS Complex = Ventricular depolarization (atrial repolarization is masked). T-wave = Ventricular repolarization. For filtering: 50Hz/60Hz mains interference is eliminated using an analog or digital Notch Filter (Band-stop filter centered at 50/60 Hz with high Q-factor). High-pass filter (~0.05-0.5 Hz) eliminates baseline wander from patient breathing, and Low-pass filter (~100-150 Hz) removes high-frequency EMG muscle noise.",
    evaluation_rubric: "Accurate physiological correlation of P, QRS, and T waves, combined with instrumentation filter design (Notch, High-pass baseline wander, Low-pass EMG)."
  },

  // ── Department: ECE (Electronics & Communication) ───────────
  {
    id: "dept_ece_1",
    category: "Electronics & Communication",
    interview_type: "technical",
    department_id: "ece",
    role_id: "embedded-engineer",
    difficulty: "easy",
    question_text: "State the Nyquist-Shannon Sampling Theorem. What is Aliasing in signal processing, and how is an anti-aliasing filter designed to prevent it before analog-to-digital conversion?",
    reference_answer: "The Nyquist Theorem states that to completely reconstruct a continuous band-limited analog signal without distortion, the sampling frequency fs must be at least twice the highest frequency component present in the signal (fs >= 2 * fmax). Aliasing occurs when fs < 2*fmax, causing higher frequency components to fold back into the lower frequency spectrum as false frequencies. An anti-aliasing filter is an analog low-pass filter placed before the ADC that attenuates all frequencies above the Nyquist frequency (fs/2).",
    evaluation_rubric: "Accurate formula fs >= 2*fmax, frequency domain folding explanation for aliasing, and low-pass filter role before the ADC."
  },
  {
    id: "dept_ece_2",
    category: "Electronics & Communication",
    interview_type: "technical",
    department_id: "ece",
    role_id: "vlsi-engineer",
    difficulty: "hard",
    question_text: "In digital VLSI design, define Setup Time and Hold Time for a D Flip-Flop. What causes Setup and Hold time violations, and what design techniques fix each violation?",
    reference_answer: "Setup Time (Tsetup) is the minimum time data must remain stable BEFORE the active clock edge. Hold Time (Thold) is the minimum time data must remain stable AFTER the active clock edge. Setup violation occurs when data takes too long to arrive (data path delay too high or clock period too short); fix by pipelining, logic optimization, or reducing clock frequency. Hold violation occurs when data arrives and changes too fast before holding (clock skew or short combinational path); fix by inserting delay buffers into the data path (cannot be fixed by slowing clock!).",
    evaluation_rubric: "Accurate temporal definitions before/after clock edge, path delay causes, and buffer insertion vs pipelining remediation."
  },

  // ── Department: EEE (Electrical & Electronics) ──────────────
  {
    id: "dept_eee_1",
    category: "Electrical Engineering",
    interview_type: "technical",
    department_id: "eee",
    role_id: "embedded-engineer",
    difficulty: "medium",
    question_text: "Explain the operating principle of a 3-phase Induction Motor. Why can the rotor never rotate at synchronous speed under normal motoring conditions?",
    reference_answer: "When a balanced 3-phase supply is given to the stator winding, a rotating magnetic field (RMF) of constant magnitude is produced, rotating at synchronous speed Ns = (120*f)/P. By Faraday's Law, this RMF cuts the stationary rotor conductors, inducing EMF and current. By Lenz's Law and Lorentz force, the rotor rotates in the direction of RMF to oppose the relative speed. If the rotor ever reached synchronous speed (Nr = Ns), the relative motion between rotor and RMF would be zero, no EMF or torque would be induced, and the rotor would immediately slow down. Thus slip s = (Ns - Nr)/Ns > 0 is essential.",
    evaluation_rubric: "Production of RMF at Ns = 120f/P, relative motion cutting conductors, Lenz's law, and logical proof of zero torque at Nr = Ns necessitating slip."
  },

  // ── Department: Civil Engineering ───────────────────────────
  {
    id: "dept_civil_1",
    category: "Civil Engineering",
    interview_type: "technical",
    department_id: "civil",
    role_id: "core-civil",
    difficulty: "medium",
    question_text: "What is the Slump Test in concrete technology? Explain the difference between true slump, shear slump, and collapse slump, and what each indicates about workability.",
    reference_answer: "The slump test measures the consistency and workability of fresh concrete using a frustum cone mold (300mm height, 200mm base, 100mm top) tamped in 3 layers. 1) True Slump: Uniform subsidence without breaking, indicating good cohesion, optimal water-cement ratio, and desirable workability. 2) Shear Slump: Top half of the cone shears off and slips sideways, indicating lack of cohesion, harsh mix, or high segregation risk (test should be repeated). 3) Collapse Slump: Mix collapses completely into a pancake shape, indicating excessively high water-cement ratio or very high slump mix.",
    evaluation_rubric: "Correct apparatus dimensions, procedure, and distinct structural characterization of True, Shear, and Collapse slumps."
  },

  // ── Department: AI & Data Science ───────────────────────────
  {
    id: "dept_aids_1",
    category: "AI & Data Science",
    interview_type: "technical",
    department_id: "aids",
    role_id: "ai-ml-engineer",
    difficulty: "medium",
    question_text: "Explain the Bias-Variance tradeoff in Machine Learning. How do underfitting and overfitting relate to bias and variance, and what regularizations reduce high variance?",
    reference_answer: "Bias is the error from overly simplistic assumptions in the learning algorithm (leads to Underfitting, where model fails on both training and test data). Variance is the error from sensitivity to small fluctuations in training data (leads to Overfitting, where model learns noise and performs well on training but poorly on test data). Total Error = Bias^2 + Variance + Irreducible Error. Techniques to reduce variance: L1 (Lasso) and L2 (Ridge) regularization, Dropout in neural nets, Early Stopping, Pruning in decision trees, bagging (Random Forests), and gathering more training data.",
    evaluation_rubric: "Clear mathematical concepts of Bias vs Variance, mapping to underfitting/overfitting, and concrete regularization strategies (L1/L2, dropout, ensemble)."
  },
  {
    id: "dept_aids_2",
    category: "AI & Data Science",
    interview_type: "technical",
    department_id: "aids",
    role_id: "ai-ml-engineer",
    difficulty: "hard",
    question_text: "Explain the Scaled Dot-Product Attention mechanism in Transformer architecture. What is the mathematical role of dividing by the square root of dimension dk?",
    reference_answer: "Attention(Q, K, V) = softmax((Q * K^T) / sqrt(dk)) * V. Q (Query) and K (Key) matrices of dimension dk are multiplied to compute similarity scores between tokens. When dk is large, dot products grow large in magnitude, pushing the softmax function into regions where gradients are extremely small (vanishing gradient problem). Dividing by sqrt(dk) scales the variance of the dot product back to 1, ensuring stable softmax gradients during backpropagation.",
    evaluation_rubric: "Attention formula with Q, K, V, dimensional role of dk, and scaling rationale preventing vanishing gradients in softmax."
  },

  // ── Career-Role Specific ────────────────────────────────────
  {
    id: "role_cyber_1",
    category: "Cybersecurity",
    interview_type: "technical",
    department_id: "cse",
    role_id: "cybersecurity-analyst",
    difficulty: "medium",
    question_text: "What is the difference between Symmetric and Asymmetric encryption? In HTTPS/TLS, how are both cryptographic systems combined to secure web communication?",
    reference_answer: "Symmetric encryption uses a single shared secret key for encryption and decryption (e.g. AES), which is computationally fast. Asymmetric encryption uses a mathematically linked key pair: Public Key for encryption and Private Key for decryption (e.g. RSA, ECC), which is slower but solves the key exchange problem. In HTTPS/TLS handshake: Asymmetric encryption is used initially to authenticate the server certificate and securely exchange a randomly generated session key. Once established, high-speed Symmetric encryption (AES-GCM) encrypts all ongoing application HTTP traffic.",
    evaluation_rubric: "Contrast single key vs public/private keys, performance difference, and TLS hybrid architecture (asymmetric for handshake key exchange, symmetric for bulk session data)."
  },
  {
    id: "role_cloud_1",
    category: "Cloud & DevOps",
    interview_type: "technical",
    department_id: "cse",
    role_id: "cloud-engineer",
    difficulty: "medium",
    question_text: "Explain the architectural difference between Docker containers and Virtual Machines. Why do containers achieve significantly faster boot times and lower memory footprints?",
    reference_answer: "A Virtual Machine runs a full guest operating system on top of a hypervisor (Type 1 or 2), virtualizing hardware resources (CPU, RAM, disk). This requires gigabytes of OS overhead and minutes to boot. A Docker Container shares the host operating system kernel and isolates processes using Linux kernel namespaces (for PID, network, mount isolation) and cgroups (for CPU/memory limits). Because containers do not boot an entire guest OS kernel, they spin up in sub-seconds and consume negligible memory overhead.",
    evaluation_rubric: "Hypervisor vs host kernel sharing, role of Linux cgroups and namespaces, and memory/boot-time comparison."
  }
];

module.exports = { questionsCatalog };
