import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { register } from 'swiper/element/bundle';

import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { SuccessModalComponent } from '../../components/success-modal/success-modal.component';

import { ApiService } from '../../../core/services/api-service';

register();

interface PrinterModel {
  name: string;
  buildSize: string;
  weight: string;
}

interface TrustStat {
  value: string;
  label: string;
}

interface LabPackage {
  name: string;
  price: string;
  badge?: string;
  features: string[];
}

interface LabType {
  icon: string;
  title: string;
  features: string[];
}

interface KitHighlight {
  icon: string;
  label: string;
  detail: string;
}

interface LearningStage {
  stage: string;
  classes: string;
  description: string;
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    SuccessModalComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShopComponent {

  contactForm: FormGroup;

  isLoading = false;

  submitError = '';

  showSuccessModal = false;


  // =====================================================
  // Section 1 — 3Cubic 3D Printer Catalogue
  // =====================================================

  printerModels: PrinterModel[] = [
    { name: 'CUB 2.25 / 2.4', buildSize: '250 x 250 x 250/400 mm', weight: '48 / 56 Kg' },
    { name: 'CUB 3.5', buildSize: '350 x 350 x 350 mm', weight: '80 Kg' },
    { name: 'CUB 4.5', buildSize: '400 x 400 x 450 mm', weight: '95 Kg' },
    { name: 'CUB 6.0', buildSize: '600 x 600 x 600 mm', weight: '158 Kg' },
  ];


  printerFeatures: string[] = [

    'THK Linear Rail (XY) + HIWIN Ball Screw (Z) for 80 micron accuracy',

    'Auto bed levelling with resume-on-power-failure & filament sensor',

    'Touch screen display with on-board emergency reset switch',

    'USB, Udisk, SD Card & Wi-Fi connectivity',

    'PLA+, ABS, PETG, HIPS, PVA, Carbon Fiber, PC, PP, TPU & wood-fill compatible',

    'Installation, training & on-site 1 year warranty included',

  ];


  printerClients: string[] = [

    'DRDO',
    'ISRO',
    'BARC',
    'Indian Army',
    'Indian Railways',
    'IITs & NITs',
    'L&T',
    'Adani',
    'Godrej'

  ];


  printerTrustStats: TrustStat[] = [

    {
      value: 'ISO 9001:2015',
      label: 'Certified Company'
    },

    {
      value: '7+ Years',
      label: 'R&D Experience'
    },

    {
      value: 'Made in India',
      label: 'Manufacturing'
    },

  ];


  // =====================================================
  // Section 2 — DUET STEM Lab Program
  // =====================================================

  labPackages: LabPackage[] = [

    {
      name: 'Mini Lab',
      price: 'Starting from ₹1.5L',
      features: [
        '5 Arduino Kits',
        'Basic Sensors Pack',
        'Online Curriculum Access',
        'Teacher Training (1 Day)',
        'Email Support'
      ],
    },

    {
      name: 'Medium Lab',
      price: 'Starting from ₹3L',
      badge: 'Most Popular',
      features: [
        '15 Arduino Kits',
        'Advanced Sensors Pack',
        '3D Printer',
        'Online + Offline Curriculum',
        'Teacher Training (3 Days)',
        'Priority Support'
      ],
    },

    {
      name: 'Large Lab',
      price: 'Starting from ₹5L',
      features: [
        '25 Arduino Kits',
        'Complete Sensors Library',
        '3D Printer + Scanner',
        'VR Equipment',
        'Complete Curriculum Suite',
        'Dedicated Support Manager'
      ],
    },

    {
      name: 'Premium Lab',
      price: 'Custom Quote',
      features: [
        '40+ Arduino Kits',
        'Full Hardware Ecosystem',
        'Multiple 3D Printers',
        'AR/VR Complete Setup',
        'Unlimited Teacher Training',
        '24/7 Dedicated Support'
      ],
    },

  ];


  labTypes: LabType[] = [

    {
      icon: 'fas fa-robot',
      title: 'AI & Robotics Lab',
      features: [
        'Block & Textual Coding',
        'AI/ML',
        'Robotics & Tinkering',
        '3D Printing & Drones'
      ]
    },

    {
      icon: 'fas fa-flask',
      title: 'Science & Computer Lab',
      features: [
        'Computer Fundamentals',
        'Physics, Chemistry, Bio, Maths Models',
        'AI/ML Activities'
      ]
    },

    {
      icon: 'fas fa-star',
      title: 'Astronomy Lab',
      features: [
        'Astronomy Models & Telescopes',
        'Robotics & Tinkering',
        'AI/ML'
      ]
    },

    {
      icon: 'fas fa-lightbulb',
      title: 'ATL Lab',
      features: [
        '3D Printing',
        'IoT Devices & Drones',
        'Robotics Kits',
        'Electronics Tools'
      ]
    },

    {
      icon: 'fas fa-cubes',
      title: 'STEM Lab',
      features: [
        'Computer Fundamentals',
        'Game Design',
        'Hands-On Robotics'
      ]
    },

    {
      icon: 'fas fa-vr-cardboard',
      title: 'AR & VR Lab',
      features: [
        'Block & Textual Coding',
        'VR Headset & 3D Printing',
        'AI/ML'
      ]
    },

  ];


  // =====================================================
  // Section 3 — DUET STEM Coding, AI & Robotics Kit
  // =====================================================

  kitHighlights: KitHighlight[] = [

    {
      icon: 'fas fa-microchip',
      label: 'Arduino Uno R3',
      detail: 'The brain of every project'
    },

    {
      icon: 'fas fa-car',
      label: '2WD Robot Chassis',
      detail: 'Geared BO motors + L298N driver'
    },

    {
      icon: 'fas fa-satellite-dish',
      label: '6 Sensor Types',
      detail: 'Ultrasonic, DHT11, LDR, Flame, IR, Soil'
    },

    {
      icon: 'fab fa-bluetooth-b',
      label: 'HC-05 Bluetooth',
      detail: 'App & Python control'
    },

    {
      icon: 'fas fa-cog',
      label: '2 Servo Motors',
      detail: 'Robotic arms & turrets'
    },

    {
      icon: 'fas fa-layer-group',
      label: '120 Projects',
      detail: '100 class-wise + 20 lab activities'
    },

  ];


  learningStages: LearningStage[] = [

    {
      stage: 'Foundation',
      classes: 'Class 3 - 5',
      description: 'Circuits, breadboard basics, first Arduino sketches'
    },

    {
      stage: 'Builder',
      classes: 'Class 6 - 8',
      description: 'Assemble & program robots, motors, servos, wireless control'
    },

    {
      stage: 'Engineer',
      classes: 'Class 9 - 10',
      description: 'Feedback control, data logging, navigation algorithms'
    },

    {
      stage: 'Innovator',
      classes: 'Class 11 - 12',
      description: 'Python, machine learning, computer vision, capstone'
    },

  ];


  // =====================================================
  // Constructor
  // =====================================================

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {

    this.contactForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150),
          Validators.pattern(
            /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '\-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/
          )
        ]
      ],

      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[6-9][0-9]{9}$/)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],

      partNeeded: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(255)
        ]
      ],

      message: [
        '',
        [
          Validators.maxLength(2000)
        ]
      ],

    });

  }


  // =====================================================
  // Submit Enquiry
  // =====================================================

  submitContactForm(): void {

    this.submitError = '';

    // Stop if form is invalid
    if (this.contactForm.invalid) {

      this.contactForm.markAllAsTouched();

      return;
    }


    // Prevent duplicate submit
    if (this.isLoading) {
      return;
    }


    this.isLoading = true;


    // -----------------------------------------------
    // Convert Angular fields to FastAPI fields
    // -----------------------------------------------

    const enquiryData = {

      full_name:
        this.contactForm.value.name?.trim(),

      mobile_number:
        this.contactForm.value.mobile?.trim(),

      email:
        this.contactForm.value.email?.trim(),

      part_kit_needed:
        this.contactForm.value.partNeeded?.trim(),

      additional_details:
        this.contactForm.value.message?.trim() || null

    };


    console.log(
      'Submitting enquiry:',
      enquiryData
    );


    // -----------------------------------------------
    // API Call
    // -----------------------------------------------

    this.apiService
      .submitEnquiry(enquiryData)
      .subscribe({

        next: (response) => {

          console.log(
            'Enquiry submitted successfully:',
            response
          );

          this.isLoading = false;

          this.showSuccessModal = true;

          this.contactForm.reset();

          this.submitError = '';

        },


        error: (error) => {

          console.error(
            'Enquiry submission failed:',
            error
          );

          this.isLoading = false;


          // FastAPI validation error
          if (error.status === 422) {

            this.submitError =
              'Please enter valid enquiry details.';

          }

          // Server error
          else if (error.status >= 500) {

            this.submitError =
              'Unable to submit your enquiry right now. Please try again later.';

          }

          // Network error
          else if (error.status === 0) {

            this.submitError =
              'Unable to connect to the server. Please check your internet connection.';

          }

          else {

            this.submitError =
              'Unable to submit your enquiry. Please try again.';

          }

        }

      });

  }


  // =====================================================
  // Submit Another / Close Modal
  // =====================================================

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  submitAnother(): void {

    this.showSuccessModal = false;

    this.isLoading = false;

    this.submitError = '';

    this.contactForm.reset();

  }


  // =====================================================
  // Scroll to Contact
  // =====================================================

  scrollToContact(): void {

    document
      .getElementById('shop-contact')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

  }

}