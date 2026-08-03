import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { TutorialArticleComponent } from '../../components/tutorial-article/tutorial-article.component';
import { TutorialService, Tutorial } from '../../../core/services/tutorial.service';
import { PlanAccessService } from '../../../core/services/plan-access.service';

@Component({
  selector: 'app-tutorial-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TutorialArticleComponent],
  templateUrl: './tutorial-detail.component.html',
  styleUrls: ['./tutorial-detail.component.scss']
})
export class TutorialDetailComponent implements OnInit {

  @ViewChild(HeaderComponent) headerComponent?: HeaderComponent;

  tutorial = signal<Tutorial | undefined>(undefined);
  upNext = signal<Tutorial[]>([]);
  loading = signal(true);
  errorMessage = signal<string | undefined>(undefined);

  isLoggedIn = false;
  isSubscribed = false; // logged in AND has the Tech Education Plan
  private userClassLevel: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tutorialService: TutorialService,
    private planAccess: PlanAccessService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const category = params.get('category');
      if (!id && !category) {
        return;
      }

      this.isLoggedIn = this.planAccess.isLoggedIn();
      this.isSubscribed = this.planAccess.hasPlanGroupAccess('tech');
      window.scrollTo(0, 0);

      if (!this.isLoggedIn) {
        // The cadapi temp token requires an authenticated session - don't bother calling it.
        this.loading.set(false);
        this.tutorial.set(undefined);
        this.errorMessage.set('Please log in to view this lesson.');
        return;
      }

      this.loading.set(true);
      this.errorMessage.set(undefined);

      this.planAccess.getUserClassLevel().subscribe(classLevel => {
        this.userClassLevel = classLevel;

        if (id) {
          this.loadTutorial(id);
        } else if (category) {
          this.resolveCategoryTutorial(category);
        }
      });
    });
  }

  private resolveCategoryTutorial(category: string): void {
    this.findFirstAvailableTutorial([
      { category, classLevel: this.userClassLevel || undefined },
      { category }
    ]);
  }

  private findFirstAvailableTutorial(
    attempts: Array<{ category?: string; classLevel?: string }>,
    index = 0
  ): void {
    const attempt = attempts[index];

    if (!attempt) {
      this.loading.set(false);
      this.errorMessage.set('No lessons are available yet.');
      return;
    }

    this.tutorialService.getTutorials(1, 500, 'published', attempt.category, attempt.classLevel).subscribe({
      next: list => {
        if (list.length) {
          this.tutorial.set(list[0]);
          this.upNext.set(list);
          this.loading.set(false);
          return;
        }

        this.findFirstAvailableTutorial(attempts, index + 1);
      },
      error: err => this.handleLoadError(err)
    });
  }

  private loadTutorial(id: string): void {
    this.tutorialService.getTutorialById(id).subscribe({
      next: tutorial => {
        this.tutorial.set(tutorial);
        this.loading.set(false);

        this.tutorialService
          .getTutorials(1, 500, 'published', tutorial?.category, this.userClassLevel || undefined)
          .subscribe(list => this.upNext.set(list));
      },
      error: err => this.handleLoadError(err)
    });
  }

  private handleLoadError(err?: any): void {
    // eslint-disable-next-line no-console
    console.error('Tutorial page failed to load:', err?.status, err?.url, err?.error || err?.message || err);
    this.loading.set(false);
    this.tutorial.set(undefined);
    this.errorMessage.set('Failed to load this lesson. Please try again.');
  }

  selectLesson(tutorial: Tutorial): void {
    this.tutorial.set(tutorial);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onLogin(): void {
    this.headerComponent?.openModal('login');
  }

  onUpgrade(): void {
    this.router.navigateByUrl('/').then(() => {
      setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    });
  }
}
