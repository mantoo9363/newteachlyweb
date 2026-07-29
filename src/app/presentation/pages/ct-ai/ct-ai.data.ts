// export interface Chapter {
//   title: string;
//   pdf: string;
// }

// export interface CurriculumClass {
//   n: number;
//   accent: string;
//   title: string;
//   math: Chapter[];
//   ai: Chapter[];
// }

export interface Chapter {
  title: string;
  pdf: string;
}

export interface CurriculumClass {
  n: number;
  accent: string;

  title: string;

  school?: string;
  age?: string;

  leftTitle?: string;
  rightTitle?: string;

  math: Chapter[];
  ai: Chapter[];
}

export const CLASSES: CurriculumClass[] = [

  {
    n: 3,
    accent: '#F2994A',
    title: 'Foundations of Number',

    math: [
      {
      title:"What's in a Name?",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/ct-ai_pdf/Class3/ch 1 what's in a name.pdf"
      },
      {
        title:"Codebraker",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/ct-ai_pdf/Class3/chapter 2 Toy joy Superpowers.pdf"
      },
      {
        title:"Double Century",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/ct-ai_pdf/Class3/chapter 3 Number Detective Casebook copy.pdf"
      },
      {
        title:"Vacation with My Nani Maa",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/ct-ai_pdf/Class3/chapter 4 Nani_Ma_s_Puzzle_Vacation.pdf"
      },
      {
        title:"Fun with Shapes",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 5 Shape Detective Adventure.pdf"
      },
      {
        title:"House of Hundreds I",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 6 slides 1 to9 House of Hundreds.pdf"
      },
      {
        title:"Raksha Bandan I",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class 3/chapter 7 CT and AI Facilitator Guide.pdf"
      },
      {
        title:"Raksha Bandhan II",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 8 Fair Share Smart Workbook.pdf"
      },
      {
        title:"Fair Share",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 9   House of Hundreds part 2 copy.pdf"
      },
      {
        title:"Filling and Lifting",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 10 Party Planning Superpowers.pdf"
      },
      {
        title:"Fun at Class Party",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 11 Logic Workshop Filling and Lifting.pdf"
      },
      {
        title:"Give and Take",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 12 give and take .pdf"
      },
      {
        title:"Time Goes On",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class3/chapter 12 give and take .pdf"
      }
    
    ],

    ai: []
  },

  {
    n: 4,
    accent: '#EB5757',
    title: 'Patterns & Measurement',

    math: [
      {
      title:"Shapes Around Us?",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class4/class4 chapter 1 Shape around us Explorer Mission.pdf"
      },
      {
        title:"Hide and Seek",
        pdf: "ttps://apifuturexcamp.theteachly.com/uploads/all pdf/Class4/class 4 chapter2 hide n seek Quest.pdf"
      },
      {
        title:"Patterns Around Us",
        pdf:"ttps://apifuturexcamp.theteachly.com/uploads/all pdf/Class4/class 4 chapter 3 Pattern around us .pdf"
      },
      {
        title:"Thousands Around Us",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class 4/Class 4 chapter 4 thousand around us.pdf"
      },
      {
        title:"Sharing and Measuring",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class 4/class4 chapter 5sharing and measuring.pdf"
      },
      {
        title:"Measuring Length",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class 4/Class 4 chapter 6 Measuring_Length.pdf"
      },
      {
        title:"The Cleanest Village",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/class 4 chapter 7 Village_Computational_Thinking_Missions.pdf"
      },
      {
        title:"Weigh It, Pour It",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/class 4 chapter 8 Measurement_Mystery_Casebook.pdf"
      },
      {
        title:"Equal Groups",
        pdf:"https://apifuturexcamp.theteachly.com/Class4/uploads/class 4 chapter 9 _Equal_Groups.pdf"
      },
      {
        title:"Elephants, Tigers & Leopards",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/Class 4 chapter 10 elephant , tiger, leopard .pdf"
      },
      {
        title:"Fun with Symmetry",
        pdf:"/https://apifuturexcamp.theteachly.com/uploads/Class4/class 4 chapter 11 fun with_Symmetry.pdf"
      },
      {
        title:"Ticking Clocks & Turnin Calendar",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/Class 4 chapter 12 ticking clock Mastering_Time (1).pdf"
      },
      {
        title:"The Transport Museum",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/class 4 chapter 13 The_Transport_Museum_Casebook.pdf"
      },
      {
        title:"Data Handling",
        pdf:"https://apifuturexcamp.theteachly.com/uploads/Class4/class 4 chapter14 The_Data_handling.pdf"
      }
      

    ],

    ai: []
  },

  {
    n: 5,
    accent: '#F2C94C',
    title: 'Journeys in Mathematics',

    math: [
      {
        title: "We the Travellers I",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 1 We the Travellers I.pdf"
      },
      {
        title: "Fractions",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 2 Fractions.pdf"
      },
      {
        title: "Angles as Turns",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 3 Angles and turnes (1).pdf"
      },
      {
        title: "We the Travellers II",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 4 we the explorer part 2.pdf"
      },
      {
        title: "Far and Near",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class5 chapter 5 Far and near .pdf"
      },
      {
        title: "The Dairy Farm",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter6 the dairy farm.pdf"
      },
      {
        title: "Shapes and Patterns",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/Class 5 chapter 7 Shape_and pattern_.pdf"
      },
      {
        title: "Weight and Capacity",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 8 weight and capacity.pdf"
      },
      {
        title: "Coconut Farm",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 9 Coconut_Farm.pdf"
      },
      {
        title: "Symmetrical Designs",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/Class 5 chapter 10 Symmetrical_Design.pdf"
      },
      {
        title: "Grandmother's Quilt",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class5 chapter 11 The_grandmother_Quilt.pdf"
      },
      {
        title: "Racing Seconds",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 12 Racing seconds.pdf"
      },
      {
        title: "Animal Jumps",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter 13  animal jumps.pdf"
      },
      {
        title: "Maps and Locations",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/Class 5 chapter 14  maps and location pdf.pdf"
      },
      {
        title: "Data Through Pictures",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class5/class 5 chapter15 Data_ through picture Detective.pdf"
      }
    ],

    ai: []
  },

  {
    n: 6,
    accent: '#27AE60',
    title: 'Structure & Intelligence',

    math: [
      {
        title: "Patterns in Mathematics",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 1  pattern in mathematics .pdf"
      },
      {
        title: "Lines and Angles",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 2  lines and angles.pdf"
      },
      {
        title: "Number Play",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 3 Number play.pdf"
      },
      {
        title: "Data Handling & Presentation",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 4 Data Handling and presentation.pdf"
      },
      {
        title: "Prime Time",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6   chapter 5 prime time.pdf"
      },
      {
        title: "Perimeter & Area",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 6 perimeter and area.pdf"
      },
      {
        title: "Fractions",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 7 Fractions.pdf"
      },
      {
        title: "Playing with Constructions",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 8 playing and contruction.pdf"
      },
      {
        title: "Symmetry",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class 6 chapter 9 Symmetry.pdf"
      },
      {
        title: "The Other Side of Zero",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6 chapter 10  other side of zero.pdf"
      }
    ],

    ai: [
      {
        title: "Introduction to Artificial Intelligence",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6 chapter 10  other side of zero.pdf"
      },
      {
        title: "Basic Data Concepts",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6 chapter 10  other side of zero.pdf"
      },
      {
        title: "Pattern Recognition & Decision Making",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6 chapter 10  other side of zero.pdf"
      },
      {
        title: "Ethics & Digital Responsibility",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class6/class6 chapter 10  other side of zero.pdf"
      }
    ]
  },

  {
    n: 7,
    accent: '#2D9CDB',
    title: 'Expressions & Applications',

    math: [
      {
        title: "Large Numbers Around Us",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 1 Large no. around us.pdf"
      },
      {
        title: "Arithmetic Expressions",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 2 AI_Industry_Command_Center.pdf"
      },
      {
        title: "A Peek Beyond the Point",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 3 Logic_to_AI.pdf"
      },
      {
        title: "Expressions using Letter Numbers",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 4 expression using letter no.pdf"
      },
      {
        title: "Parallel & Intersecting Lines",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 5 paralleland intersecting lines .pdf"
      },
      {
        title: "Number Play",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class7 chapter 6 number play.pdf"
      },
      {
        title: "Tale of Three Intersecting Lines",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 7 tale of intersecting lines.pdf"
      },
      {
        title: "Working with Fractions",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 8 working with Fraction.pdf"
      }
    ],

    ai: [
      {
        title: "AI Domains & Applications",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 8 working with Fraction.pdf"
      },
      {
        title: "AI in Industries",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 8 working with Fraction.pdf"
      },
      {
        title: "Data Visualisation & Analysis",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 8 working with Fraction.pdf"
      },
      {
        title: "Ethics & AI Bias Awareness",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class7/class 7 chapter 8 working with Fraction.pdf"
      }
    ]
  },

  {
    n: 8,
    accent: '#9B51E0',
    title: 'Reasoning & Responsibility',

    math: [
      {
        title: "A Square and a Cube",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 1 AI Square Cube Blueprint (1).pdf"
      },
      {
        title: "Power Play",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 2 AI Logic Power Play (2).pdf"
      },
      {
        title: "A Story of Numbers",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 3 Building the Digital World.pdf"
      },
      {
        title: "Quadrilaterals",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 4 System Logic and Digital Ethics.pdf"
      },
      {
        title: "Number Play",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 5 Decoding Number Logic.pdf"
      },
      {
        title: "We Distribute Yet Things Multiply",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER  6.pdf"
      },
      {
        title: "Proportional Reasoning",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/Class8/CLASS 8 CHAPTER 7.pdf"
      }
      
    ],

    ai: [
      {
        title: "AI Project Lifecycle",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/AI/AI Project Lifecycle.pdf"
      },
      {
        title: "Artificial Intelligence & Applications",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/AI/Artificial Intelligence & Applications.pdf"
      },
      {
        title: "Data & Fairness in AI",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/AI/Data & Fairness in AI.pdf"
      },
      {
        title: "Ethics & Responsible AI",
        pdf: "https://apifuturexcamp.theteachly.com/uploads/AI/Ethics & Responsible AI.pdf"
      }
    ]
  },
// ================= CLASS 9 =================
{
  n: 9,
  accent: "#8E44AD",
  title: "Class 9",
  school: "Secondary School",
  age: "14–15",

  leftTitle: "Python & Programming",
  rightTitle: "AI & Machine Learning",

  math: [
    {
      title: "Python fundamentals (syntax, variables, I/O)",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/Python fundamentals (syntax, variables, I-O).pdf"
    },
    {
      title: "Functions, lists & dictionaries",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/Functions, lists & dictionaries.pdf"
    },
    {
      title: "Structured problem-solving frameworks",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/Structured problem-solving frameworks.pdf"
    }
  ],

  ai: [
    {
      title: "AI project lifecycle & design",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/AI project lifecycle & design.pdf"
    },
    {
      title: "Data acquisition & exploration",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/Data acquisition & exploration.pdf"
    },
    {
      title: "Machine Learning fundamentals",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class9/Machine Learning fundamentals.pdf"
    }
  ]
},

// ================= CLASS 10 =================
{
  n: 10,
  accent: "#F39C12",
  title: "Class 10",
  school: "Secondary School",
  age: "15–16",

  leftTitle: "Python & Programming",
  rightTitle: "AI & Machine Learning",

  math: [
    {
      title: "Modules, file handling & data analysis",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/Modules, file handling & data analysis.pdf"
    },
    {
      title: "Software development projects",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/Software development projects.pdf"
    },
    {
      title: "Collaborative coding practices",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/Collaborative coding practices.pdf"
    }
  ],

  ai: [
    {
      title: "Natural Language Processing (NLP) basics",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/Natural Language Processing (NLP) basics.pdf"
    },
    {
      title: "Computer Vision applications",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/Computer Vision applications.pdf"
    },
    {
      title: "AI model testing & evaluation",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class10/AI model testing & evaluation.pdf"
    }
  ]
},

// ================= CLASS 11 =================
{
  n: 11,
  accent: "#16A085",
  title: "Class 11",
  school: "Senior Secondary",
  age: "16–17",

  leftTitle: "Advanced Computing",
  rightTitle: "AI & Emerging Tech",

  math: [
    {
      title: "Advanced Python & Object-Oriented Programming",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class11/Advanced Python & Object-Oriented Programming.pdf"
    },
    {
      title: "Data Structures & Algorithms & C++ programming",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/ct-ai_pdf/Class11/Data Structures & Algorithms & C++ programming.pdf"
    },
    {
      title: "GUI-Based Operating System",
      pdf: "https://apifuturexcamp.theteachly.comuploads//Class11/GUI-Based Operating System.pdf"
    }
  ],

  ai: [
    {
      title: "Deep Learning & Neural Networks",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class11/Deep Learning & Neural Networks.pdf"
    },
    {
      title: "Generative AI & Large Language Models (LLMs)",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class11/Generative AI & Large Language Models (LLMs).pdf"
    },
    {
      title: "OpenAI APIs & Hugging Face introduction",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class11/OpenAI APIs & Hugging Face introduction.pdf"
    }
  ]
},

// ================= CLASS 12 =================
{
  n: 12,
  accent: "#E74C3C",
  title: "Class 12",
  school: "Senior Secondary",
  age: "17–18",

  leftTitle: "Advanced Computing",
  rightTitle: "AI & Emerging Tech",

  math: [
    {
      title: "Cloud Computing & IoT",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class12/Cloud Computing & IoT.pdf"
    },
    {
      title: "Artificial Intelligence & Data Science",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class12/Artificial Intelligence & Data Science.pdf"
    },
    {
      title: "Cyber Security & Ethical Hacking",
      pdf: "hhttps://apifuturexcamp.theteachly.com/uploads/Class12/Cyber Security & Ethical Hacking.pdf"
    }
  ],

  ai: [
    {
      title: "AI product development",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class12/AI product development.pdf"
    },
    {
      title: "Ethical AI, governance & regulations",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class12/Ethical AI, governance & regulations.pdf"
    },
    {
      title: "Career-ready AI project showcase",
      pdf: "https://apifuturexcamp.theteachly.com/uploads/Class12/Career-ready AI project showcase.pdf"
    }
  ]
}

  // {
  //   n: 9,
  //   accent: '#1b4965',
  //   title: 'Reasoning & Responsibility',

  //   math: [
  //     'A Square and a Cube',
  //     'Power Play',
  //     'A Story of Numbers',
  //     'Quadrilaterals',
  //     'Number Play',
  //     'We Distribute Yet Things Multiply',
  //     'Proportional Reasoning'
  //   ],

  //   ai: [
  //     'AI Project Lifecycle',
  //     'Artificial Intelligence & Applications',
  //     'Data & Fairness in AI',
  //     'Ethics & Responsible AI'
  //   ]
  // },

];

export const chapters = [
  {
    no: "01",
    title: "Patterns in Mathematics",
    pdf: "assets/pdfs/Algorithmic_Racing.pdf"
  },
  // {
  //   no: "02",
  //   title: "Lines and Angles",
  //   pdf: "assets/pdfs/lines-and-angles.pdf"
  // },
  // {
  //   no: "03",
  //   title: "Number Play",
  //   pdf: "assets/pdfs/number-play.pdf"
  // }
];