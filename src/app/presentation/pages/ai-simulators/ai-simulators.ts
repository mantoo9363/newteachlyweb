import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-simulators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-simulators.html',
  styleUrl: './ai-simulators.scss',
})
export class AiSimulatorsComponent{

  simulators = [
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    },
    {
      title: 'Dam Site',
      image: 'assets/images/dam.jpg'
    }
  ];

}