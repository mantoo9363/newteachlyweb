import { Component, OnInit, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { SimulatorService, Simulator } from '../../../core/services/simulator.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule , Router } from '@angular/router';


@Component({
  selector: 'app-simulator',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, FormsModule, TranslateModule, RouterModule],
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.scss']
})
export class SimulatorComponent implements OnInit {
  simulators = signal<Simulator[]>([]);
  filteredSimulators = signal<Simulator[]>([]);
  searchQuery = signal('');
  viewMode = signal<'grid' | 'list'>('grid');
  sortBy = signal('Newest');
  selectedSimulator = signal<Simulator | null>(null);
  selectedVideo = signal<string | null>(null);
  selectedClass = signal<string>('All');

  allSimulators: Simulator[] = [];

  

  filters = {
    subjects: [
      { name: 'Physics', sub: ['Motion', 'Sound & Waves', 'Work, Energy & Power', 'Heat & Thermo', 'Quantum Phenomena', 'Light & Radiation', 'Electricity, Magnets & Circuits'], open: true },
      { name: 'Math & Statistics', sub: ['Math Concepts', 'Math Applications'], open: false },
      { name: 'Chemistry', sub: ['General Chemistry', 'Quantum Chemistry'], open: false },
      { name: 'Earth & Space', sub: [], open: false },
      { name: 'Biology', sub: [], open: false }
    ],
    gradeLevels: ['Elementary School', 'Middle School', 'High School', 'University'],
    compatibility: ['HTML5', 'Flash', 'Java']
  };

  showClasses = false;

  classGroups = [
    'Class 1-5',
    'Class 6-10',
    'Class 11-University'
  ];

  selectedSubjects = new Set<string>();
  selectedGrades = new Set<string>();
  selectedCompat = new Set<string>();

  selectedClassGroup: '1-5' | '6-10' | '11-university' = '6-10';
  constructor(
  private simulatorService: SimulatorService,
  private translate: TranslateService,
  private meta: Meta,
  private router: Router
) {}

  ngOnInit(): void {
    this.simulatorService.getSimulators().subscribe(data => {
  console.log(data.find(x => x.id === 'quantum-measurement'));
});
    this.meta.updateTag({ name: 'description', content: 'Browse our collection of interactive STEM Virtual Lab. Filter by subject (Physics, Math, Chemistry, Biology) and grade level to find the perfect simulation for your needs.' });
    this.updateCanonical('https://apifuturexcamp.theteachly.com/uploads/videos/simulator');
    this.simulatorService.getSimulators().subscribe(data => {

    this.simulators.set(data);
    this.allSimulators = data;

    // Show random 12 simulators initially
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    this.filteredSimulators.set(shuffled.slice(0, 12));

    });
  }

  openWalkthrough() {
  this.selectedVideo.set('/videos/Simulators/AREA BUILDER.mp4');
}

  toggleClasses() {
    this.showClasses = !this.showClasses;
  }

  selectClassGroup(group: string) {
    console.log("Clicked:", group);

  this.selectedClassGroup = group as '1-5' | '6-10' | '11-university';

  this.selectedGrades.clear();

  switch (group) {

    case 'Class 1-5':
      ['1', '2', '3', '4', '5'].forEach(c => this.selectedGrades.add(c));
      break;

    case 'Class 6-10':
      ['6', '7', '8', '9', '10'].forEach(c => this.selectedGrades.add(c));
      break;

    case 'Class 11-University':
      ['11', '12'].forEach(c => this.selectedGrades.add(c));
      break;
  }

  this.applyFilters();

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

  toggleSubject(sub: string) {
    if (this.selectedSubjects.has(sub)) {
      this.selectedSubjects.delete(sub);
    } else {
      this.selectedSubjects.add(sub);
    }
    this.applyFilters();
  }

  toggleGrade(grade: string) {
    if (this.selectedGrades.has(grade)) {
      this.selectedGrades.delete(grade);
    } else {
      this.selectedGrades.add(grade);
    }
    this.applyFilters();
  }

  toggleCompat(compat: string) {
    if (this.selectedCompat.has(compat)) {
      this.selectedCompat.delete(compat);
    } else {
      this.selectedCompat.add(compat);
    }
    this.applyFilters();
  }

  goToSimulator(sim: Simulator) {
  this.closeVideo();
  this.router.navigate(['/view-simulator', sim.id]);
  }

 applyFilters() {

  let filtered = this.simulators();

  // Detect selected class group
  if (this.selectedGrades.size > 0) {

    if (['1', '2', '3', '4', '5'].some(cls => this.selectedGrades.has(cls))) {
      this.selectedClassGroup = '1-5';

    } else if (['6', '7', '8', '9', '10'].some(cls => this.selectedGrades.has(cls))) {
      this.selectedClassGroup = '6-10';

    } else if (['11', '12', 'University'].some(cls => this.selectedGrades.has(cls))) {
      this.selectedClassGroup = '11-university';
    }

  }

  // Subject Filter
  if (this.selectedSubjects.size > 0) {
    filtered = filtered.filter(
      s =>
        this.selectedSubjects.has(s.subject) ||
        this.selectedSubjects.has(s.category)
    );
  }

  // Class Filter
  if (this.selectedGrades.size > 0) {
    filtered = filtered.filter(sim =>
      sim.classes.some(cls => this.selectedGrades.has(cls))
    );
  }

  // Search Filter
  if (this.searchQuery()) {
    const q = this.searchQuery().toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q)
    );
  }

  this.filteredSimulators.set(filtered);

}

  onSortChange() {
    this.applyFilters();
  }

//   openVideo(sim: Simulator) {
//   if (sim.videoUrl) {
//     window.open(sim.videoUrl, '_blank');
//   } else {
//     alert('Video not available');
//   }
// }

onVideoEnded() {
  const sim = this.selectedSimulator();

  if (!sim) return;

  console.log("Opening:", sim.url);

  window.location.href = sim.url;
}
openVideo(sim: Simulator) {

  console.log("Simulator Object:", sim);
  console.log("sim.videoUrl:", sim.videoUrl);

  let video = sim.videoUrl; // Default

  if (sim.videoUrls) {
    video = sim.videoUrls[this.selectedClassGroup] || sim.videoUrl;
  }

  if (!video) {
    this.goToSimulator(sim);
    return;
  }

  this.selectedSimulator.set(sim);
  this.selectedVideo.set(video);
}

  closeVideo() {
    this.selectedVideo.set(null);
  }

  showSubjects = false;

expandedSubjects = new Set<string>();

toggleSubTopics(subject: string) {

  if (this.expandedSubjects.has(subject)) {
    this.expandedSubjects.delete(subject);
  } else {
    this.expandedSubjects.add(subject);
  }

}
}
