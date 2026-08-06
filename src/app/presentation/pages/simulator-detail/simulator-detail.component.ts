import { Component, OnInit, signal, effect } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { SimulatorService, Simulator } from '../../../core/services/simulator.service';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-simulator-detail',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, TranslateModule],
  templateUrl: './simulator-detail.component.html',
  styleUrls: ['./simulator-detail.component.scss']
})
export class SimulatorDetailComponent implements OnInit {
  simulator = signal<Simulator | undefined>(undefined);
  isPlaying = signal(false);
  safeUrl = signal<SafeResourceUrl | undefined>(undefined);
  activeTab = signal('About');

  tabs = ['About', 'Teaching Resources', 'Activities', 'Presets', 'Translations', 'Credits'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private simulatorService: SimulatorService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private titleService: Title,
    private metaService: Meta
  ) {
    // Listen to language changes to update simulator URL
    effect(() => {
      const sim = this.simulator();
      if (sim) {
        this.updateSimulatorUrl();
        this.titleService.setTitle(`Teachly | ${sim.name} - Interactive Simulation`);
        this.metaService.updateTag({ name: 'description', content: `Explore the ${sim.name} simulation. Learn STEM concepts through interactive experimentation and visual feedback.` });
        this.updateCanonical(`${environment.urls.site}/view-simulator/${sim.id}`);
      }
    });
  }

  private updateCanonical(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  ngOnInit(): void {
    // Check for trailing slash in URL and redirect if present to avoid static folder conflict on reload
    if (window.location.pathname.endsWith('/')) {
      const cleanPath = window.location.pathname.slice(0, -1);
      this.router.navigateByUrl(cleanPath + window.location.search, { replaceUrl: true });
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    const playParam = this.route.snapshot.queryParamMap.get('play');
    
    if (id) {
      this.simulatorService.getSimulatorById(id).subscribe(sim => {
        this.simulator.set(sim);
        if (sim) {
          this.updateSimulatorUrl();
          if (playParam === 'true') {
            this.isPlaying.set(true);
          }
        }
      });
    }

    // Subscribe to lang change events
    this.translate.onLangChange.subscribe(() => {
      this.updateSimulatorUrl();
    });
  }

  updateSimulatorUrl() {
    const sim = this.simulator();
    if (!sim) return;

    let url = sim.url;
    const currentLang = this.translate.currentLang || 'en';
    
    // Support both .html and .xhtml extensions
    const isXhtml = url.endsWith('.xhtml');
    const suffix = isXhtml ? '_all.xhtml' : '_all.html';
    const urSuffix = isXhtml ? '_ur.xhtml' : '_ur.html';
    
    if (currentLang === 'ur' && url.includes(suffix)) {
      url = url.replace(suffix, urSuffix);
    } else if (currentLang !== 'en' && currentLang !== 'ur' && url.includes(suffix)) {
      url = url.replace(suffix, `_${currentLang}${isXhtml ? '.xhtml' : '.html'}`);
    }

    this.safeUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  playSimulator() {
    this.isPlaying.set(true);
    // Add query param without reloading to persist play state on refresh
    // Remove trailing slash if present to avoid conflict with static folder
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    window.history.replaceState({}, '', `${cleanPath}?play=true`);
  }

  closeSimulator() {
    this.isPlaying.set(false);
    // Remove query param and trailing slash
    const cleanPath = window.location.pathname.replace(/\/$/, '');
    window.history.replaceState({}, '', `${cleanPath}`);
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  getTabTranslation(tab: string): string {
    const tabMap: { [key: string]: string } = {
      'About': 'simulator.detail.about',
      'Teaching Resources': 'simulator.detail.resources',
      'Activities': 'simulator.detail.activities',
      'Presets': 'simulator.detail.presets',
      'Translations': 'simulator.detail.translations',
      'Credits': 'simulator.detail.credits'
    };
    const key = tabMap[tab] || tab;
    return this.translate.instant(key);
  }

  getSubjectTranslation(name: string): string {
    const subjectMap: { [key: string]: string } = {
      'Physics': 'simulator.categories.physics',
      'Math & Statistics': 'simulator.categories.math',
      'Chemistry': 'simulator.categories.chemistry',
      'Earth & Space': 'simulator.categories.earth',
      'Biology': 'simulator.categories.biology',
      'Motion': 'simulator.subjects.motion',
      'Sound & Waves': 'simulator.subjects.sound',
      'Work, Energy & Power': 'simulator.subjects.work',
      'Heat & Thermo': 'simulator.subjects.heat',
      'Quantum Phenomena': 'simulator.subjects.quantum',
      'Light & Radiation': 'simulator.subjects.light',
      'Electricity, Magnets & Circuits': 'simulator.subjects.circuits',
      'Math Concepts': 'simulator.subjects.mathConcepts',
      'Math Applications': 'simulator.subjects.mathApps',
      'General Chemistry': 'simulator.subjects.genChem',
      'Quantum Chemistry': 'simulator.subjects.quantumChem'
    };
    const key = subjectMap[name] || name;
    return this.translate.instant(key);
  }

  getGradeTranslation(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      'Elementary School': 'simulator.grades.elementary',
      'Middle School': 'simulator.grades.middle',
      'High School': 'simulator.grades.high',
      'University': 'simulator.grades.university'
    };
    const key = gradeMap[grade] || grade;
    return this.translate.instant(key);
  }

  getGradeListTranslation(grades: string[]): string {
    return grades.map(g => this.getGradeTranslation(g)).join(', ');
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.updateSimulatorUrl();
  }
}
