import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {
  faqs = signal([
    {
      question: "What is Teachly and how is it different?",
      answer: "Teachly is India's first genuine one-stop learning platform. We combine board-aligned curriculum (Class 6-College) with simulators for AI, Drones, and Robotics, foreign languages, and 24/7 AI doubt resolution—all in one affordable subscription.",
      isOpen: false
    },
    {
      question: "How is Teachly different from YouTube?",
      answer: "Unlike YouTube, Teachly provides systematic board-aligned structure, 24/7 contextual doubt resolution, and hands-on experience through simulators where you actually build and fly projects instead of just watching them.",
      isOpen: false
    },
    {
      question: "Is it suitable for non-tech students?",
      answer: "Yes! Teachly is designed for everyone. We start from the basics with no prior coding or tech knowledge required. Our AI teacher and intuitive simulators guide you at your own pace.",
      isOpen: false
    },
    {
      question: "How much does Teachly cost?",
      answer: "Teachly is priced to be accessible to every Indian family, costing a fraction of traditional coaching. One subscription replaces multiple tuition classes, coaching, and apps.",
      isOpen: false
    },
    {
      question: "What is Ask Doubt 24/7?",
      answer: "It's an AI teacher avatar that knows your exact lesson context. Pause any video, ask a doubt via scan, text, or audio, and get a specific answer in seconds, anytime.",
      isOpen: false
    },
    {
      question: "Does it cover my school board?",
      answer: "We cover CBSE, ICSE, and UP Board for Classes 6 to 12. Additionally, we offer future-skills modules and competitive exam prep for all learners.",
      isOpen: false
    },
    {
      question: "Which foreign languages are available?",
      answer: "We offer structured courses in French, German, Arabic, Sanskrit, Spanish, and IELTS, designed for everyone from school students to working professionals.",
      isOpen: false
    },
    {
      question: "Can we learn Robotics without hardware?",
      answer: "Yes. Our advanced simulators replicate real-world labs. Students program drones and robots in a digital environment with identical learning outcomes but zero equipment cost or risk.",
      isOpen: false
    },
    {
      question: "How do I get started?",
      answer: "It takes under 2 minutes. Sign up at teachly.com for a free trial—no credit card required. Explore all subjects, simulators, and the AI teacher immediately.",
      isOpen: false
    }
  ]);

  toggleFaq(index: number) {
    this.faqs.update(currentFaqs => {
      const updated = [...currentFaqs];
      updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
      return updated;
    });
  }
}
