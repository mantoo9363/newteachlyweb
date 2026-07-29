import { Component, OnInit } from '@angular/core';
import { Meta, Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-cognitive-skill-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './cognitive-skill-profile.component.html',
  styleUrls: ['./cognitive-skill-profile.component.scss']
})
export class CognitiveSkillProfileComponent implements OnInit {
  structuredData: SafeHtml | undefined;

  constructor(
    private meta: Meta, 
    private title: Title,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Cognitive Skill Profile | Advanced Student Assessment & Mastery Learning');
    
    this.meta.updateTag({ 
      name: 'description', 
      content: 'Discover Teachly\'s Cognitive Skill Profile: A data-driven approach to measure student abilities across multiple levels of thinking, from recall to creative problem-solving.' 
    });
    
    this.meta.updateTag({ 
      name: 'keywords', 
      content: 'Cognitive Skill Profile, Student Assessment, STEM Learning, Educational Technology, Higher-Order Thinking Skills, Mastery Learning, Data-Driven Education, Personalized Learning, Bloom\'s Taxonomy Assessment' 
    });

    this.meta.updateTag({ property: 'og:title', content: 'Cognitive Skill Profile | Advanced Student Assessment' });
    this.meta.updateTag({ property: 'og:description', content: 'Transforming learning behavior into measurable cognitive data for real-world success.' });
    this.meta.updateTag({ property: 'og:image', content: 'https://theteachly.com/image/WhatsApp%20Image%202026-04-30%20at%205.19.46%20PM.jpeg' });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    this.setStructuredData();
  }

  private setStructuredData(): void {
    const json = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Cognitive Skill Profile",
      "description": "A data-driven approach to measure and map a student’s cognitive abilities across multiple levels of thinking.",
      "publisher": {
        "@type": "Organization",
        "name": "Teachly",
        "logo": {
          "@type": "ImageObject",
          "url": "https://theteachly.com/image/TEACHLY%20LOGO%20Circle.png"
        }
      },
      "mainEntity": {
        "@type": "EducationalOccupationalCredential",
        "name": "Cognitive Skill Assessment",
        "educationalLevel": "Multiple Levels",
        "competencyRequired": "Recall, Understanding, Application, Analysis, Decision-Making, Creative Problem-Solving"
      }
    };
    
    this.structuredData = this.sanitizer.bypassSecurityTrustHtml(
      `<script type="application/ld+json">${JSON.stringify(json)}</script>`
    );
  }
}
