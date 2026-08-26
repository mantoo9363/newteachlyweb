import { Injectable } from '@angular/core';
 import { Plan } from './plan.model';



@Injectable({ providedIn: 'root' })
export class PlansService {
  readonly superplans: Plan[] = [
    {
      id: 19,
      productName: 'Smart & Tech(Institute Level)',
      pid: 'ST-1111',
      requirements: 'Lending Page',
      mrp: 148937,
      discountPercent: 53,
      finalPrice: 70000,
      imgUrl: '/images/smart-tech-70k.png',
      demoRoute: '',
      backendPlanKey:'school'
    },
    {
      id: 20,
      productName: 'Tech Education (Institute Level)',
      pid: 'T-112',
      requirements: 'Lending Page',
      mrp: 106383,
      discountPercent: 53,
      finalPrice: 50000,
      imgUrl: '/images/tech-education-50k.png',
      demoRoute: '',
      backendPlanKey:'tech'
    },
    {
      id: 21,
      productName: 'Smart Education (Institute Level)',
      pid: 'S-111',
      requirements: 'Lending Page',
      mrp: 76000,
      discountPercent: 50,
      finalPrice: 38000,
      imgUrl: '/images/smart-education.png',
      demoRoute: '',
      backendPlanKey:'smart'
    },
  ];

  readonly plans: Plan[] = [
    
      {
    id: 1,
    productName: 'School Curriculum + Ask Doubts',
    pid: 'SCAD-100',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/school-curriculum.png',
    demoRoute: 'curriculum-details',
    backendPlanKey: 'school_curriculum'
  },

  {
    id: 2,
    productName: 'Virtual Lab',
    pid: 'VL-222',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/virtual-lab.png',
    demoRoute: 'simulator',
    backendPlanKey: 'virtual_lab'
  },

  {
    id: 3,
    productName: 'CT/AI',
    pid: 'AI-333',
    requirements: 'Lending Page',
    mrp: 62,
    discountPercent: 35,
    finalPrice: 487,
    imgUrl: '/images/ct-ai.png',
    demoRoute: '/ctai',
    backendPlanKey: 'ct_ai'
  },

  {
    id: 4,
    productName: 'Cognitive Skill',
    pid: 'CS-444',
    requirements: 'Lending Page',
    mrp: 66,
    discountPercent: 35,
    finalPrice: 519,
    imgUrl: '/images/cognitive-skill.png',
    demoRoute: 'cognitive-skill-profile',
    backendPlanKey: 'cognitive_skill'
  },

  {
    id: 5,
    productName: 'Child Psychology',
    pid: 'CP-555',
    requirements: 'Lending Page',
    mrp: 50,
    discountPercent: 35,
    finalPrice: 389,
    imgUrl: '/images/child-psychology.png',
    demoRoute: 'child-psychology',
    backendPlanKey: 'child_psychology'
  },

  {
    id: 6,
    productName: 'AI',
    pid: 'AI-111',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/ai.png',
    demoRoute: 'curriculum-details?id=13&title=AI%20Learning%20Module',
    backendPlanKey: 'ai'
  },

  {
    id: 7,
    productName: 'Robotics',
    pid: 'RB-111',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/robotics.png',
    demoRoute: 'curriculum-details?id=10&title=Robotics%20Virtual%20Lab%20Module',
    backendPlanKey: 'robotics'
  },

  {
    id: 8,
    productName: 'Drone',
    pid: 'DR-111',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/drone.png',
    demoRoute: 'curriculum-details?id=12&title=Drone%20Virtual%20Lab%20Module',
    backendPlanKey: 'drone'
  },

  {
    id: 9,
    productName: 'CBSE',
    pid: 'CBSE-1113',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/cbse.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fboard%2Fcbse',
    backendPlanKey: 'cbse'
  },

  {
    id: 10,
    productName: 'ICSE',
    pid: 'ICSE-1119',
    requirements: 'Lending Page',
    mrp: 83,
    discountPercent: 35,
    finalPrice: 649,
    imgUrl: '/images/icse.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fboard%2Ficse',
    backendPlanKey: 'icse'
  },

  {
    id: 11,
    productName: 'UP',
    pid: 'UP-11121',
    requirements: 'Lending Page',
    mrp: 58,
    discountPercent: 35,
    finalPrice: 454,
    imgUrl: '/images/up.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fstudent.theteachly.com%2Fauth%2Flogin',
    backendPlanKey: 'up'
  },

  {
    id: 12,
    productName: 'German',
    pid: 'GR-111',
    requirements: 'Lending Page',
    mrp: 42,
    discountPercent: 35,
    finalPrice: 324,
    imgUrl: '/images/german.png',
    demoRoute: '/iframe-view',
    iframeUrl: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fcourse%2Fgerman-language',
    backendPlanKey: 'german'
  },

  {
    id: 13,
    productName: 'French',
    pid: 'FR-111',
    requirements: 'Lending Page',
    mrp: 42,
    discountPercent: 35,
    finalPrice: 324,
    imgUrl: '/images/french.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fcourse%2Ffrench-language',
    backendPlanKey: 'french'
  },

  {
    id: 14,
    productName: 'Spanish',
    pid: 'SP-111',
    requirements: 'Lending Page',
    mrp: 42,
    discountPercent: 35,
    finalPrice: 324,
    imgUrl: '/images/spanish.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fcourse%2Fspanish-language',
    backendPlanKey: 'spanish'
  },

  {
    id: 15,
    productName: 'Arabic',
    pid: 'AR-111',
    requirements: 'Lending Page',
    mrp: 42,
    discountPercent: 35,
    finalPrice: 324,
    imgUrl: '/images/arabic.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fcourse%2Farabic-language',
    backendPlanKey: 'arabic'
  },

  {
    id: 16,
    productName: 'Sanskrit',
    pid: 'SA-111',
    requirements: 'Lending Page',
    mrp: 42,
    discountPercent: 35,
    finalPrice: 324,
    imgUrl: '/images/sanskrit.png',
    demoRoute: 'iframe-view?url=https:%2F%2Fzenai.theteachly.com%2Fcourse%2Fsanskrit',
    backendPlanKey: 'sanskrit'
  },

  {
    id: 17,
    productName: 'Smart & Tech Individual',
    pid: 'STI-111',
    requirements: 'Lending Page',
    mrp: 3459,
    discountPercent: 35,
    finalPrice: 2248,
    imgUrl: '/images/smart-tech-individual.png',
    demoRoute: '',
    backendPlanKey: 'smart_tech_individual'
  },

  {
    id: 18,
    productName: 'Tech Education Plan - individual',
    pid: 'tech-111',
    requirements: 'Lending Page',
    mrp: 1400,
    discountPercent: 50,
    finalPrice: 700,
    imgUrl: '/images/tech-education-individual.png',
    demoRoute: '',
    backendPlanKey: 'tech-111'
  },
    {
      id: 19,
      productName: 'Smart Tech(School Level)- 70K package',
      pid: 'ST-1111',
      requirements: 'Lending Page',
      mrp: 148937,
      discountPercent: 53,
      finalPrice: 70000,
      imgUrl: '/images/smart-tech-70k.png',
      demoRoute: '',
       backendPlanKey:''
    },
    {
      id: 20,
      productName: 'Tech Education Plan -50K',
      pid: 'T-112',
      requirements: 'Lending Page',
      mrp: 106383,
      discountPercent: 53,
      finalPrice: 50000,
      imgUrl: '/images/tech-education-50k.png',
      demoRoute: '',
       backendPlanKey:''
    },
    {
      id: 21,
      productName: 'Smart Education Plan',
      pid: 'S-111',
      requirements: 'Lending Page',
      mrp: 76000,
      discountPercent: 50,
      finalPrice: 38000,
      imgUrl: '/images/smart-education.png',
      demoRoute: '',
       backendPlanKey:''
    },
    {
      id: 22,
      productName: 'Smart Education - Individual',
      pid: 'S-112',
      requirements: 'Lending Page',
      mrp: 1400,
      discountPercent: 50,
      finalPrice: 1400,
      imgUrl: '/images/smart-education.png',
      demoRoute: 'curriculum-details',
       backendPlanKey:''
    },
   
  ];

  /** All plans excluding the featured/super plans (19, 20, 21) — mirrors HomePage's filteredPlans */
  getFilteredPlans(): Plan[] {
    return this.plans.filter(
      (plan) => plan.id !== 19 && plan.id !== 20 && plan.id !== 21
    );
  }

  getByPid(pid: string): Plan | undefined {
    return this.plans.find((p) => p.pid === pid);
  }
}
