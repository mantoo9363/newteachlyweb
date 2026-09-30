import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  name: string;
  designation: string;
  school: string;
  message: string;
  image: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {

  // LEFT CAROUSEL
  leftIndex = 0;

  leftTestimonials: Testimonial[] = [
    {
      name: 'Rohit Sharma',
      designation: 'Principal',
      school: 'Sunrise Public School',
      message: 'This platform has completely transformed the way our school manages learning. The support team is amazing and always ready to help.',
      image: 'assets/images/user1.jpg'
    },
    {
      name: 'Amit Verma',
      designation: 'Director',
      school: 'Delhi Public School',
      message: 'A very useful and reliable platform for managing our school activities and communication.',
      image: 'assets/images/user2.jpg'
    },
    {
      name: 'Sanjay Kumar',
      designation: 'Principal',
      school: 'Modern School',
      message: 'The platform has made our daily school management much easier and more efficient.',
      image: 'assets/images/user3.jpg'
    }
  ];


  // RIGHT CAROUSEL
  rightIndex = 0;

  rightTestimonials: Testimonial[] = [
    {
      name: 'Neha Verma',
      designation: 'Teacher',
      school: 'Bright Future School',
      message: 'Easy to use, feature-rich and extremely reliable. It has helped us improve student engagement and communication with parents.',
      image: 'assets/images/user4.jpg'
    },
    {
      name: 'Priya Singh',
      designation: 'Teacher',
      school: 'Green Valley School',
      message: 'The interface is simple and the features are very helpful for teachers and students.',
      image: 'assets/images/user5.jpg'
    },
    {
      name: 'Pooja Sharma',
      designation: 'Coordinator',
      school: 'St. Xavier School',
      message: 'Excellent platform with great support and very useful educational features.',
      image: 'assets/images/user6.jpg'
    }
  ];


  // LEFT CAROUSEL
  leftNext(): void {
    this.leftIndex =
      (this.leftIndex + 1) % this.leftTestimonials.length;
  }

  leftPrevious(): void {
    this.leftIndex =
      (this.leftIndex - 1 + this.leftTestimonials.length) %
      this.leftTestimonials.length;
  }

  leftGoTo(index: number): void {
    this.leftIndex = index;
  }


  // RIGHT CAROUSEL
  rightNext(): void {
    this.rightIndex =
      (this.rightIndex + 1) % this.rightTestimonials.length;
  }

  rightPrevious(): void {
    this.rightIndex =
      (this.rightIndex - 1 + this.rightTestimonials.length) %
      this.rightTestimonials.length;
  }

  rightGoTo(index: number): void {
    this.rightIndex = index;
  }
}