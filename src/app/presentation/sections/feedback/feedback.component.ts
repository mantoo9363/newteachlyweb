import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  currentIndex = 2; // Start at index 2 because we'll have 2 clones at the beginning
  private autoSlideInterval: any;
  isPaused = false;
  isTransitioning = false;
  disableTransition = false;

  testimonials = [
    {
      id: 1,
      text: "My daughter's math scores improved from 65% to 94% in just 3 months! The AI teacher explains concepts so clearly, and she loves the animated videos.",
      name: "Mrs. Priya Sharma",
      role: "Parent • Daughter in Class 9, CBSE",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      rating: 5
    },
    {
      id: 2,
      text: "I used to struggle with science, but Teachly's concept animations made everything so easy to understand. Now science is my favorite subject!",
      name: "Rahul Mehta",
      role: "Student • Class 8, ICSE",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      rating: 5
    },
    {
      id: 3,
      text: "The parent dashboard is amazing! I can see exactly what my son is learning and how he's performing. It gives me peace of mind.",
      name: "Mr. Rajesh Kumar",
      role: "Parent • Son in Class 10, State Board",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      rating: 5
    },
    {
      id: 4,
      text: "The Virtual Labs are a game changer. My son spent hours experimenting with circuits safely. It's like having a high-end lab at home.",
      name: "Anita Desai",
      role: "Parent • Class 10",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      rating: 5
    },
    {
      id: 5,
      text: "Teachly made physics fun for me. I love how I can 'Simulate Now' and see the results instantly. It's way better than just reading books.",
      name: "Karan Singh",
      role: "Student • Class 11",
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
      rating: 5
    }
  ];

  displayTestimonials: any[] = [];

  getSlideWidth(): number {
    if (typeof window === 'undefined') return 100;
    if (window.innerWidth > 1024) return 33.333;
    if (window.innerWidth > 640) return 50;
    return 88;
  }

  getTransform(): string {
    const width = this.getSlideWidth();
    // Centering the active slide
    const offset = width === 100 ? 0 : (100 - width) / 2;
    return `translateX(${-this.currentIndex * width + offset}%)`;
  }

  ngOnInit(): void {
    // True Infinite loop: Clone last 2 items at start and first 2 items at end
    // This ensures that even during transition, the viewport is filled.
    const lastItems = this.testimonials.slice(-2);
    const firstItems = this.testimonials.slice(0, 2);
    
    this.displayTestimonials = [
      ...lastItems,
      ...this.testimonials,
      ...firstItems
    ];
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      if (!this.isPaused && !this.isTransitioning) {
        this.next();
      }
    }, 4000);
  }

  stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  next(): void {
    if (this.isTransitioning) return;
    this.currentIndex++;
    this.isTransitioning = true;
    this.handleInfiniteLoop();
  }

  prev(): void {
    if (this.isTransitioning) return;
    this.currentIndex--;
    this.isTransitioning = true;
    this.handleInfiniteLoop();
  }

  private handleInfiniteLoop(): void {
    // Wait for the transition to finish (matches CSS duration: 0.6s)
    setTimeout(() => {
      this.isTransitioning = false;
      
      const realCount = this.testimonials.length;
      if (this.currentIndex >= realCount + 2) {
        this.disableTransition = true;
        this.currentIndex = 2;
        setTimeout(() => this.disableTransition = false, 20);
      } else if (this.currentIndex <= 1) {
        this.disableTransition = true;
        this.currentIndex = realCount + 1;
        setTimeout(() => this.disableTransition = false, 20);
      }
    }, 600);
  }

  goTo(index: number): void {
    if (this.isTransitioning) return;
    this.currentIndex = index + 2;
    this.resetAutoSlide();
  }

  pauseAutoSlide(): void {
    this.isPaused = true;
  }

  resumeAutoSlide(): void {
    this.isPaused = false;
  }

  private resetAutoSlide(): void {
    this.startAutoSlide();
  }

  // Helper for active dot calculation
  getActiveDotIndex(): number {
    const realCount = this.testimonials.length;
    let index = (this.currentIndex - 2) % realCount;
    if (index < 0) index += realCount;
    return index;
  }
}
