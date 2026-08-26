import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Tutorial } from '../../../core/services/tutorial.service';

@Component({
  selector: 'app-tutorial-article',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial-article.component.html',
  styleUrls: ['./tutorial-article.component.scss']
})
export class TutorialArticleComponent {
  @Input() tutorial: Tutorial | undefined;
  @Input() upNext: Tutorial[] = [];
  @Input() loading = false;
  @Input() isLoggedIn = false;
  @Input() isSubscribed = false; // logged in AND has the Tech Education Plan
  @Input() errorMessage: string | undefined;

  @Output() selectUpNext = new EventEmitter<Tutorial>();
  @Output() login = new EventEmitter<void>();
  @Output() upgrade = new EventEmitter<void>();

  backgroundUrl(url: string): string {
    // Quoted so paths containing spaces (e.g. "/image/AI Learning.jpeg") stay valid CSS.
    return `url('${url}')`;
  }

  relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return '1 day ago';
    return `${days} days ago`;
  }
}
