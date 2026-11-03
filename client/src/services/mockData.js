export const DEMO_USERS = {
  'student@learnhub.dev': {
    id: 'user-student-001',
    name: 'Alex Morgan',
    email: 'student@learnhub.dev',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: 'Full-Stack Software Engineering Aspirant'
  },
  'instructor@learnhub.dev': {
    id: 'user-instructor-002',
    name: 'Dr. Sarah Chen',
    email: 'instructor@learnhub.dev',
    role: 'instructor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: 'Principal Full-Stack Architect & Ex-Google Staff Instructor'
  },
  'admin@learnhub.dev': {
    id: 'user-admin-003',
    name: 'Elena Rostova',
    email: 'admin@learnhub.dev',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    headline: 'LearnPulse Platform Lead Administrator'
  }
};

export const MOCK_COURSES = [
  {
    _id: '67c1001a1111111111111101',
    title: 'Full-Stack Web Development 2026: React 19, Node.js & Cloud',
    subtitle: 'Build and deploy scalable modern web applications from scratch with modern MERN architecture.',
    description: 'Master full-stack engineering with the latest industry tooling. This curriculum takes you from frontend fundamentals with React 19, modern hooks, and state management, to building robust Express REST APIs, connecting MongoDB Atlas, and shipping to cloud hosting services like Vercel and Render.',
    category: 'Web Development',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Chen',
    instructorTitle: 'Principal Full-Stack Architect',
    duration: '12.5 Hours',
    rating: 4.9,
    reviewsCount: 320,
    enrolledCount: 1420,
    tags: ['React 19', 'Node.js', 'Express', 'MongoDB Atlas', 'Vite', 'REST API'],
    learningOutcomes: [
      'Design Single Page Applications with React 19 and React Router',
      'Build secure RESTful APIs using Express.js and JSON Web Tokens',
      'Model scalable schema structures using Mongoose and MongoDB Atlas',
      'Deploy full-stack applications to Vercel with zero downtime'
    ],
    lessons: [
      {
        _id: 'les-001',
        title: '1. Welcome & Full-Stack Architecture Roadmap',
        duration: '15 min',
        videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk',
        summary: 'Understanding modern client-server relationships, HTTP protocol basics, and the 2026 MERN ecosystem.'
      },
      {
        _id: 'les-002',
        title: '2. React 19 Components, State & Modern Hooks',
        duration: '28 min',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        summary: 'Deep dive into functional components, custom hooks, useEffect lifecycle patterns, and state minimization.'
      },
      {
        _id: 'les-003',
        title: '3. Express REST API Architecture & MongoDB Atlas Modeling',
        duration: '35 min',
        videoUrl: 'https://www.youtube.com/embed/Oe421EPjeBE',
        summary: 'Creating modular routers, controllers, Mongoose schemas, and database connection pooling in serverless environments.'
      }
    ],
    quizzes: [
      {
        _id: 'quiz-001',
        question: 'What is the primary benefit of deploying an Express backend as a Serverless Function on Vercel?',
        options: [
          'It charges for compute 24/7 even when no requests are arriving',
          'It automatically scales on-demand with zero cold maintenance and scales to zero when idle',
          'It replaces MongoDB Atlas completely without any database configuration',
          'It requires maintaining dedicated Linux virtual machines'
        ],
        correctAnswer: 1,
        explanation: 'Serverless architecture spins up compute only when requests arrive, resulting in zero hosting costs during idle periods while providing instant scalability.'
      },
      {
        _id: 'quiz-002',
        question: 'Which HTTP method should be utilized for secure user login submission?',
        options: [
          'GET with email and password in the URL query parameters',
          'POST with credentials safely encrypted in the request body',
          'DELETE with parameters in headers',
          'TRACE with authorization keys'
        ],
        correctAnswer: 1,
        explanation: 'POST requests transmit credentials securely within the request body, preventing sensitive passwords from leaking into browser history or proxy server logs.'
      }
    ]
  },
  {
    _id: '67c1001a1111111111111102',
    title: 'Machine Learning & Generative AI Systems: From Theory to Production',
    subtitle: 'Harness Large Language Models, Vector Embeddings, and Python neural pipelines.',
    description: 'A comprehensive curriculum designed for developers who want to transition into Artificial Intelligence and Machine Learning engineering. Covers supervised learning algorithms, neural network design, Hugging Face transformers, retrieval-augmented generation (RAG), and production LLM deployment.',
    category: 'Artificial Intelligence',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Chen',
    instructorTitle: 'Principal Full-Stack Architect',
    duration: '18.0 Hours',
    rating: 4.95,
    reviewsCount: 480,
    enrolledCount: 2150,
    tags: ['Python', 'Machine Learning', 'PyTorch', 'Vector DB', 'Transformers', 'GenAI'],
    learningOutcomes: [
      'Understand core neural network mathematics and gradient descent backpropagation',
      'Fine-tune state-of-the-art open source LLMs on custom domain datasets',
      'Architect low-latency Retrieval-Augmented Generation (RAG) pipelines with Vector databases',
      'Evaluate model hallucinations, safety constraints, and inference throughput'
    ],
    lessons: [
      {
        _id: 'les-101',
        title: '1. Neural Networks & Mathematical Intuition',
        duration: '22 min',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        summary: 'Exploring linear transformations, activation functions, loss curves, and backpropagation mechanics.'
      },
      {
        _id: 'les-102',
        title: '2. Transformers & Attention Mechanisms Explained',
        duration: '34 min',
        videoUrl: 'https://www.youtube.com/embed/wjZofJX0v4U',
        summary: 'Understanding self-attention, query-key-value vectors, positional encodings, and why transformers revolutionized AI.'
      }
    ],
    quizzes: [
      {
        _id: 'quiz-101',
        question: 'What is the core role of a Vector Database in a modern GenAI application?',
        options: [
          'It replaces relational SQL databases for financial ledger transactions',
          'It stores and performs high-speed similarity search over high-dimensional vector embeddings',
          'It compresses video files for high-speed streaming',
          'It generates CSS stylesheets for web applications'
        ],
        correctAnswer: 1,
        explanation: 'Vector databases index high-dimensional numeric embeddings produced by AI models, enabling lightning-fast semantic similarity search for RAG systems.'
      }
    ]
  },
  {
    _id: '67c1001a1111111111111103',
    title: 'UI/UX Design Systems & Product Architecture',
    subtitle: 'Design stunning, intuitive software interfaces with modern Figma workflows and accessibility.',
    description: 'Bridge the gap between product design and engineering. Learn typography scales, fluid layout grids, atomic component libraries, user research methodologies, micro-interactions, and WCAG accessibility standards.',
    category: 'UI/UX Design',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Chen',
    instructorTitle: 'Principal Full-Stack Architect',
    duration: '9.0 Hours',
    rating: 4.88,
    reviewsCount: 195,
    enrolledCount: 980,
    tags: ['UI/UX', 'Figma', 'Design Systems', 'Accessibility', 'Interaction Design'],
    learningOutcomes: [
      'Master typography, spacing tokens, and modern color harmony systems',
      'Build reusable atomic component systems with auto-layout in Figma',
      'Conduct user usability interviews and synthesis mapping',
      'Ensure WCAG 2.2 AA accessibility and responsive mobile patterns'
    ],
    lessons: [
      {
        _id: 'les-201',
        title: '1. Fundamentals of Visual Hierarchy & Spacing Tokens',
        duration: '18 min',
        videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
        summary: 'How spacing rules, typography scales, and contrast ratios guide user eye movement.'
      }
    ],
    quizzes: [
      {
        _id: 'quiz-201',
        question: 'What does WCAG Level AA color contrast compliance require for normal text?',
        options: [
          'A minimum contrast ratio of 4.5:1 against its background',
          'A contrast ratio of at least 1:1',
          'Only dark black text on white backgrounds',
          'It does not specify contrast requirements'
        ],
        correctAnswer: 0,
        explanation: 'WCAG 2.2 Level AA guidelines specify that standard text must achieve at least a 4.5:1 contrast ratio against the background to ensure readability for visually impaired users.'
      }
    ]
  },
  {
    _id: '67c1001a1111111111111104',
    title: 'Cloud Native Architecture with Docker & Kubernetes',
    subtitle: 'Containerize microservices, automate CI/CD pipelines, and scale multi-zone infrastructure.',
    description: 'Learn modern DevOps engineering and cloud native infrastructure. Understand Linux cgroups, Dockerfile multi-stage optimization, Kubernetes Pod orchestration, ingress controllers, Helm charts, and automated GitHub Actions deployment pipelines.',
    category: 'Cloud & DevOps',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    instructorName: 'Dr. Sarah Chen',
    instructorTitle: 'Principal Full-Stack Architect',
    duration: '14.0 Hours',
    rating: 4.92,
    reviewsCount: 260,
    enrolledCount: 1100,
    tags: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Cloud Architecture', 'Linux'],
    learningOutcomes: [
      'Write optimized multi-stage Dockerfiles with minimal image attack surface',
      'Deploy and orchestrate Kubernetes Deployments, Services, and Ingress',
      'Configure automated CI/CD deployment pipelines using GitHub Actions',
      'Monitor production metrics with Prometheus and Grafana dashboards'
    ],
    lessons: [
      {
        _id: 'les-301',
        title: '1. Containerization Fundamentals & Docker Architecture',
        duration: '25 min',
        videoUrl: 'https://www.youtube.com/embed/fqMOX6JJhGo',
        summary: 'Demystifying namespaces, cgroups, layers, daemon processes, and multi-stage container optimization.'
      }
    ],
    quizzes: [
      {
        _id: 'quiz-301',
        question: 'What is the chief advantage of multi-stage Docker builds?',
        options: [
          'They combine source code with compilers to produce giant images',
          'They dramatically decrease production image size and security vulnerabilities by excluding build tools',
          'They run multiple operating systems simultaneously',
          'They avoid using Docker containers altogether'
        ],
        correctAnswer: 1,
        explanation: 'Multi-stage builds leave behind compilers, SDKs, and build caches, copying only the final compiled artifact into a lightweight runtime image.'
      }
    ]
  }
];
