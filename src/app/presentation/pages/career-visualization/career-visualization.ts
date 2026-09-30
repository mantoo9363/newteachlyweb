import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import {
  FilesetResolver,
  PoseLandmarker,
  FaceDetector
} from '@mediapipe/tasks-vision';


import * as faceapi from 'face-api.js';
import { ApiService } from '../../../core/services/api-service';

interface CareerFormData {

  parentName: string;
  phone: string;
  parentEmail: string;

}

interface StoryUploadData {

  // =========================
  // CHILD DETAILS
  // =========================
  studentName: string;
  class: string;
  age: number | null;

  // =========================
  // CAREER
  // =========================
  career: string;
  otherCareer: string;

  // =========================
  // VOICE
  // =========================
  voice: File | null;
  voicePreview: string;

  // =========================
  // IMAGES
  // =========================
  fullBodyImage: File | null;
  shoulderImage: File | null;
  faceImage: File | null;

  fullBodyPreview: string;
  shoulderPreview: string;
  facePreview: string;

  // =========================
  // VALIDATION
  // =========================
  fullBodyValid: boolean;
  shoulderValid: boolean;
  faceValid: boolean;

  samePersonValidated: boolean;
}

@Component({
  selector: 'app-career-visualization',
  imports: [
    FormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './career-visualization.html',
  styleUrl: './career-visualization.css'
})
export class CareerVisualization {
  constructor(
    private cdr: ChangeDetectorRef,
    private careerVisualizationService: ApiService
  ) {}

  allowLettersOnly(value: string): string {
  return value.replace(/[^A-Za-z ]/g, '');
}

allowNumbersOnly(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

openPersonalizedPopup(): void {
  this.showPersonalizedPopup = true;
}

closePersonalizedPopup(): void {
  this.showPersonalizedPopup = false;
}
 
getStoryCount(): number {
  if (this.selectedPlan === '2 Stories') {
    return 2;
  }

  if (this.selectedPlan === '4 Stories') {
    return 4;
  }

  return 1;
}
getMaxStoryCount(): number {
  return this.getStoryCount();
}

createEmptyStory(): StoryUploadData {
  return {

    // =========================
    // CHILD DETAILS
    // =========================
    studentName: '',
    class: '',
    age: null,

    // =========================
    // CAREER
    // =========================
    career: '',
    otherCareer: '',

    // =========================
    // VOICE
    // =========================
    voice: null,
    voicePreview: '',

    // =========================
    // IMAGES
    // =========================
    fullBodyImage: null,
    shoulderImage: null,
    faceImage: null,

    fullBodyPreview: '',
    shoulderPreview: '',
    facePreview: '',

    // =========================
    // VALIDATION
    // =========================
    fullBodyValid: false,
    shoulderValid: false,
    faceValid: false,

    samePersonValidated: false
  };
}

//selectPlanAndGoToForm(plan: string, price: number): void {

  //this.selectedPlan = plan;
  //this.selectedPlanPrice = price;

  //console.log('Selected Plan:', plan);
  //console.log('Selected Price:', price);

  // Form ke liye selected plan save
  //sessionStorage.setItem('careerPlan', plan);
  //sessionStorage.setItem('careerPlanPrice', price.toString());

  // Form section par smooth scroll
  //setTimeout(() => {

    //const formSection = document.getElementById(
      //'career-registration-form'
    //);

    //if (formSection) {

      //const y =
        //formSection.getBoundingClientRect().top +
        //window.pageYOffset -
        //20;

      //window.scrollTo({
        //top: y,
        //behavior: 'smooth'
      //});

    //}

  //}, 100);


//}
 
selectPlanAndGoToForm(plan: string, price: number): void {
  this.selectedPlan = plan;
  this.selectedPlanPrice = price;


  // Initially only Story 1
  this.stories = [this.createEmptyStory()];

  // Consent initially disabled
  this.parentConsent = false;

  sessionStorage.setItem('careerPlan', plan);
  sessionStorage.setItem(
    'careerPlanPrice',
    price.toString()
  );

  setTimeout(() => {
    const formSection =
      document.getElementById('career-registration-form');

    if (formSection) {
      const y =
        formSection.getBoundingClientRect().top +
        window.pageYOffset -
        20;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  }, 100);
}

canAddAnotherChild(): boolean {
  return this.stories.length < this.getMaxStoryCount();
}

addAnotherChild(): void {

  if (!this.canAddAnotherChild()) {
    return;
  }

  const currentStoryIndex = this.stories.length - 1;
  const currentStory = this.stories[currentStoryIndex];

  if (!this.isStoryComplete(currentStory)) {
    alert(
      `Please complete Story ${currentStoryIndex + 1} before adding another child.`
    );
    return;
  }

  this.stories.push(this.createEmptyStory());

  this.parentConsent = false;

  setTimeout(() => {
    const storyElement = document.getElementById(
      `story-${this.stories.length - 1}`
    );

    if (storyElement) {
      storyElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
}

isStoryComplete(story: StoryUploadData): boolean {

  if (!story.studentName.trim()) {
    return false;
  }

  if (!/^[A-Za-z ]{2,50}$/.test(story.studentName.trim())) {
    return false;
  }

  if (!story.class.trim()) {
    return false;
  }

  if (
    story.age === null ||
    story.age === undefined
  ) {
    return false;
  }

  const allowedAges = [
    5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15,
    16, 17, 18, 19, 20,
    21, 22, 23, 24, 25
  ];

  if (!allowedAges.includes(Number(story.age))) {
    return false;
  }

  if (!story.career.trim()) {
    return false;
  }

  if (story.career === 'Others') {

    if (!story.otherCareer.trim()) {
      return false;
    }

    const careerPattern =
      /^[A-Za-z][A-Za-z .&-]{1,49}$/;

    if (!careerPattern.test(story.otherCareer.trim())) {
      return false;
    }
  }

  if (!story.voice) {
    return false;
  }

  if (!story.fullBodyImage || !story.fullBodyValid) {
    return false;
  }

  if (!story.shoulderImage || !story.shoulderValid) {
    return false;
  }

  if (!story.faceImage || !story.faceValid) {
    return false;
  }


  return true;
}

get allStoriesComplete(): boolean {

  return (
    this.stories.length === this.getMaxStoryCount() &&
    this.stories.every(story =>
      this.isStoryComplete(story)
    )
  );
}
get allStoriesReadyForConsent(): boolean {
  return this.allStoriesComplete;
}

  poseLandmarker!: PoseLandmarker;
  faceDetector!: FaceDetector;
  faceModelLoaded: boolean = false;
  //faceModelsLoaded: boolean = false;
  faceApiLoaded: boolean = false;

  private referenceFaceDescriptor: Float32Array | null = null;
  samePersonValidated: boolean = false;
  faceValidationMessage: string = ''; 

  fullBodyPreview: string = '';
  fullBodyValid: boolean = false;
  fullBodyMessage: string = '';

  poseModelLoaded: boolean = false;
  checkingFullBody: boolean = false;
  showFullBodyPreview: boolean = false;

  shoulderPreview: string = '';
  shoulderValid: boolean = false;
  showShoulderPreview: boolean = false;
  
  facePreview: string = '';
  faceValid: boolean = false;
  showFacePreview: boolean = false;
  parentConsent: boolean = false;
  selectedPlan: string = '';
  selectedPlanPrice: number = 0;
  showPersonalizedPopup: boolean = false;
  stories: StoryUploadData[] = [this.createEmptyStory()];
  formData: CareerFormData = { 

    
    parentName: '',
    phone: '',
    parentEmail: '',
  };
 async ngOnInit(): Promise<void> {
  this.loadPoseLandmarker();
  this.loadFaceDetector();

  await this.loadFaceApiModels();
}


  async loadPoseLandmarker(): Promise<void> {

  try {

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    this.poseLandmarker =
      await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
          },

          runningMode: 'IMAGE',

          numPoses: 1
        }
      );

    this.poseModelLoaded = true;
    

 

    console.log(
      ' MediaPipe Pose Landmarker loaded'
    );

  } catch (error) {

    console.error(
      ' MediaPipe model loading failed:',
      error
    );

    this.poseModelLoaded = false;

  }

}

async loadFaceDetector(): Promise<void> {

  try {

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );

    this.faceDetector = await FaceDetector.createFromOptions(
      vision,
      {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite'
        },

        runningMode: 'IMAGE',

        minDetectionConfidence: 0.6
      }
    );

    console.log('MediaPipe Face Detector loaded');

  } catch (error) {

    console.error(
      'Face Detector loading failed:',
      error
    );

  }
}

async loadFaceApiModels(): Promise<void> {
  try {

    console.log('Loading Face API models...');

    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

    console.log('Tiny Face Detector loaded');

    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

    console.log('Face Landmark model loaded');

    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    console.log('Face Recognition model loaded');

    this.faceApiLoaded = true;

    console.log('✅ Face API models loaded successfully');

  } catch (error) {

    console.error('❌ Face API model loading failed:', error);

    this.faceApiLoaded = false;
  }
}

private async detectSingleFaceDescriptor(
  file: File
): Promise<Float32Array | null> {

  if (!this.faceApiLoaded) {
    console.error('Face API models are not loaded yet.');
    return null;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await faceapi.fetchImage(imageUrl);

    const detections = await faceapi
      .detectAllFaces(
        image,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.15
        })
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    console.log(
      `Faces detected in ${file.name}:`,
      detections.length
    );

    // MUST HAVE EXACTLY ONE FACE
    if (detections.length !== 1) {
      return null;
    }

    return detections[0].descriptor;

  } catch (error) {

    console.error(
      `Face detection failed for ${file.name}:`,
      error
    );

    return null;

  } finally {

    URL.revokeObjectURL(imageUrl);

  }
}

private async validateSamePersonForStory(index: number): Promise<boolean> {

  const story = this.stories[index];

  const fullBody = story.fullBodyImage;
  const shoulder = story.shoulderImage;
  const face = story.faceImage;

  if (!fullBody || !shoulder || !face) {
    story.samePersonValidated = false;
    return false;
  }

  //if (!this.faceApiLoaded) {
    //alert(
     // 'Face verification system is still loading. Please wait a moment.'
    //);

    //story.samePersonValidated = false;
    //return false;
 // }

  console.log(
    `Starting same-person verification for Story ${index + 1}...`
  );

  // ==============================
  // FULL BODY FACE
  // ==============================

  const fullBodyDescriptor =
    await this.detectSingleFaceDescriptor(fullBody);

  if (!fullBodyDescriptor) {

    alert(
      `Story ${index + 1}: Full Body image must contain exactly one clear face. Group photos are not allowed.`
    );

    story.fullBodyImage = null;
    story.fullBodyPreview = '';
    story.fullBodyValid = false;
    story.samePersonValidated = false;

    return false;
  }

  // ==============================
  // SHOULDER FACE
  // ==============================

  const shoulderDescriptor =
    await this.detectSingleFaceDescriptor(shoulder);

  if (!shoulderDescriptor) {

    alert(
      `Story ${index + 1}: Up-to-Shoulder image must contain exactly one clear face. Group photos are not allowed.`
    );

    story.shoulderImage = null;
    story.shoulderPreview = '';
    story.shoulderValid = false;
    story.samePersonValidated = false;

    return false;
  }

  // ==============================
  // FACE IMAGE
  // ==============================

  const faceDescriptor =
    await this.detectSingleFaceDescriptor(face);

  if (!faceDescriptor) {

    alert(
      `Story ${index + 1}: Face image must contain exactly one clear face. Group photos are not allowed.`
    );

    story.faceImage = null;
    story.facePreview = '';
    story.faceValid = false;
    story.samePersonValidated = false;

    return false;
  }

  // ==============================
  // COMPARE ALL 3
  // ==============================

  const distanceFullShoulder =
    faceapi.euclideanDistance(
      fullBodyDescriptor,
      shoulderDescriptor
    );

  const distanceFullFace =
    faceapi.euclideanDistance(
      fullBodyDescriptor,
      faceDescriptor
    );

  const distanceShoulderFace =
    faceapi.euclideanDistance(
      shoulderDescriptor,
      faceDescriptor
    );

  console.log(
    `Story ${index + 1} face distances:`,
    {
      fullBodyShoulder: distanceFullShoulder,
      fullBodyFace: distanceFullFace,
      shoulderFace: distanceShoulderFace
    }
  );

  const MAX_DISTANCE = 0.55;

  const samePerson =
    distanceFullShoulder <= MAX_DISTANCE &&
    distanceFullFace <= MAX_DISTANCE &&
    distanceShoulderFace <= MAX_DISTANCE;

  if (!samePerson) {

    story.samePersonValidated = false;

    alert(
      `Story ${index + 1}: The same student must appear in all three images. Please upload photos of the same person.`
    );

    return false;
  }

  // ==============================
  // VALID
  // ==============================

  story.samePersonValidated = true;

  this.faceValidationMessage =
    `Story ${index + 1}: All three images belong to the same person.`;

  console.log(
    `✅ Same person verified for Story ${index + 1}`
  );

  return true;
}
async submitForm(): Promise<void> {

  // =========================================
  // 1. CHECK EMPTY FORM FIRST
  // =========================================

 const allStoriesEmpty = this.stories.every(story =>
    !story.studentName.trim() &&
    !story.class.trim() &&
    story.age === null &&
    !story.career.trim() &&
    !story.voice &&
    !story.fullBodyImage &&
    !story.shoulderImage &&
    !story.faceImage
  );

  if (
    !this.formData.parentName.trim() &&
    !this.formData.phone.trim() &&
    !this.formData.parentEmail.trim() &&
    allStoriesEmpty
  ) {
    alert('Please fill the form.');
    return;
  }



  // =========================================
  // 2. PARENT NAME
  // =========================================

  if (!this.formData.parentName.trim()) {
    alert('Please enter Parent Name.');
    return;
  }

  const namePattern = /^[A-Za-z ]{2,50}$/;

  if (!namePattern.test(this.formData.parentName.trim())) {
    alert(
      'Invalid Parent Name.\n\n' +
      'Name should contain letters only.'
    );
    return;
  }


  // =========================================
  // 3. PHONE NUMBER
  // =========================================

  if (!this.formData.phone.trim()) {
    alert('Please enter Parent Phone Number.');
    return;
  }

  const phonePattern = /^[6-9][0-9]{9}$/;

  if (!phonePattern.test(this.formData.phone.trim())) {
    alert(
      'Invalid Phone Number.\n\n' +
      'Please enter a valid 10-digit mobile number.'
    );
    return;
  }


  // =========================================
  // 4. PARENT EMAIL
  // =========================================

  if (!this.formData.parentEmail.trim()) {
    alert('Please enter Parent Email.');
    return;
  }

  const emailPattern =
    /^[A-Za-z0-9._%+-]+@(gmail|yahoo)\.(com|in)$/i;

  if (!emailPattern.test(this.formData.parentEmail.trim())) {
    alert(
      'Invalid Parent Email.\n\n' +
      'Please use a valid Gmail or Yahoo email address.'
    );
    return;
  }

  // =========================================
// 5. VALIDATE EACH STORY
// =========================================

for (let i = 0; i < this.stories.length; i++) {

  const story = this.stories[i];
  // =========================================
  // 5. STUDENT NAME
  // =========================================

   if (!story.studentName.trim()) {
    alert(`Please enter Student Name for Story ${i + 1}.`);
    return;
  }

  if (!namePattern.test(story.studentName.trim())) {
    alert(
      `Invalid Student Name for Story ${i + 1}.\n\n` +
      'Name should contain letters only.'
    );
    return;
  }   


  // =========================================
  // 6. CLASS
  // =========================================

  if (!story.class.trim()) {
    alert(`Please select Class for Story ${i + 1}.`);
    return;
  }


  // =========================================
  // 7. AGE
  // =========================================

  if (story.age === null || story.age === undefined) {
    alert(`Please select Student Age for Story ${i + 1}.`);
    return;
  }

  const allowedAges = [
    5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15,
    16, 17, 18, 19, 20,
    21, 22, 23, 24, 25
  ];

  if (!allowedAges.includes(Number(story.age))) {
    alert(
      `Invalid Student Age for Story ${i + 1}.`
    );
    return;
  }
  


  // =========================================
// 8. CAREER
// =========================================

if (!story.career.trim()) {
  alert(`Please select Career for Story ${i + 1}.`);
  return;
}


// =========================================
// NORMAL CAREER
// =========================================

if (story.career !== 'Others') {

  // Normal career selected
  // Other career must be blank

  story.otherCareer = '';

}


// =========================================
// OTHER CAREER
// =========================================

if (story.career === 'Others') {

  if (!story.otherCareer.trim()) {
    alert(
      `Please enter your Career Choice for Story ${i + 1}.`
    );
    return;
  }

  const careerPattern =
    /^[A-Za-z][A-Za-z .&-]{1,49}$/;

  if (!careerPattern.test(story.otherCareer.trim())) {
    alert(
      `Invalid Career Choice for Story ${i + 1}.\n\n` +
      'Please enter a valid career name.'
    );
    return;
  }
}



  // =========================================
  // 9. VOICE
  // =========================================

  if (!story.voice) {

    alert(
      `Please upload Student Voice for Story ${i + 1}.`
    );

    return;
  }



  // =========================================
  // 10. FULL BODY IMAGE
  // =========================================

   if (
    !story.fullBodyImage ||
    !story.fullBodyValid
  ) {

    alert(
      `Please upload a valid Full Body Image for Story ${i + 1}.`
    );

    return;
  }

  // =========================================
  // 11. SHOULDER IMAGE
  // =========================================

  if (
    !story.shoulderImage ||
    !story.shoulderValid
  ) {

    alert(
      `Please upload a valid Up-to-Shoulder Image for Story ${i + 1}.`
    );

    return;
  }


  // =========================================
  // 12. FACE IMAGE
  // =========================================

  if (
    !story.faceImage ||
    !story.faceValid
  ) {

    alert(
      `Please upload a valid Face Image for Story ${i + 1}.`
    );

    return;
  }
}


  // =========================================
  // 13. PARENT CONSENT - CHECK LAST
  // =========================================

  if (!this.parentConsent) {
    alert(
      'Please tick the parent consent checkbox before submitting the form.'
    );
    return;
  }

  // =========================================
// 14. SAME PERSON VALIDATION FOR EACH STORY
// =========================================

for (let i = 0; i < this.stories.length; i++) {

  console.log(
    `Starting same-person validation for Story ${i + 1}...`
  );

  const samePersonValid =
    await this.validateSamePersonForStory(i);

  if (!samePersonValid) {
    console.log(
      `❌ Same-person validation failed for Story ${i + 1}`
    );
    return;
  }

  console.log(
    `✅ Story ${i + 1} same-person validation passed`
  );
}

  // ==========================================
// 14. CREATE API FORM DATA
// ==========================================
console.log('STEP 1: submitForm started');

console.log('STEP 2: Validation passed');
const formData = new FormData();

formData.append(
  'parent_name',
  this.formData.parentName
);

formData.append(
  'phone',
  this.formData.phone
);

formData.append(
  'parent_email',
  this.formData.parentEmail
);

formData.append(
  'parent_consent',
  this.parentConsent.toString()
);

// ==========================================
// STORIES + FILES
// ==========================================

formData.append(
  'story_count',
  this.stories.length.toString()
);

formData.append(
  'plan',
  this.selectedPlan
);

// ==========================================
// STORY TEXT DATA
// ==========================================

formData.append(
  'student_names',
  this.stories.map(story =>
    story.studentName
  ).join(',')
);

formData.append(
  'student_classes',
  this.stories.map(story =>
    story.class
  ).join(',')
);

formData.append(
  'student_ages',
  this.stories.map(story =>
    story.age!.toString()
  ).join(',')
);

// ==========================================
// CAREER DATA FOR API
// ==========================================

const careersForApi = this.stories.map(story => {

  // Normal dropdown career selected
  if (story.career !== 'Others') {
    return story.career.trim();
  }

  // Others selected
  return '';

});


const otherCareersForApi = this.stories.map(story => {

  // Others selected → manual career
  if (story.career === 'Others') {
    return story.otherCareer.trim();
  }

  // Normal dropdown career → NULL/blank
  return '';

});


console.log(
  'FINAL careers:',
  careersForApi
);

console.log(
  'FINAL other careers:',
  otherCareersForApi
);


// ==========================================
// SEND TO FASTAPI
// ==========================================

formData.append(
  'careers',
  careersForApi.join(',')
);

formData.append(
  'other_careers',
  otherCareersForApi.join(',')
);

// ==========================================
// DEBUG CAREER DATA
// ==========================================

console.log('OTHER CAREERS FOR API:', otherCareersForApi);
console.log('OTHER CAREERS JOINED:', otherCareersForApi.join(','));

console.log(
  'FINAL careers:',
  this.stories.map(s => s.career)
);

console.log(
  'FINAL other careers:',
  this.stories.map(
    s => s.career === 'Others'
      ? s.otherCareer
      : null
  )
);
// ==========================================
// DEBUG CAREER DATA
// ==========================================

console.log(
  'FINAL careers:',
  this.stories.map(s => s.career)
);

console.log(
  'FINAL other careers:',
  this.stories.map(
    s => s.career === 'Others'
      ? s.otherCareer
      : null
  )
);
// ==========================================
// STORY FILES
// ==========================================

for (let i = 0; i < this.stories.length; i++) {

  const story = this.stories[i];

  formData.append(
    'voices',
    story.voice!,
    story.voice!.name
  );

  formData.append(
    'full_body_images',
    story.fullBodyImage!,
    story.fullBodyImage!.name
  );

  formData.append(
    'shoulder_images',
    story.shoulderImage!,
    story.shoulderImage!.name
  );

  formData.append(
    'face_images',
    story.faceImage!,
    story.faceImage!.name
  );
}
// ==========================================
// SEND TO FASTAPI
// ==========================================

console.log(
  'Sending Career Visualization data to API...'
);

console.log('========== FORM DATA DEBUG ==========');

formData.forEach((value, key) => {
  if (value instanceof File) {
    console.log(key, 'FILE:', value.name);
  } else {
    console.log(key, ':', value);
  }
});

console.log('====================================');

this.careerVisualizationService
  .submitCareerVisualization(formData)
  .subscribe({
    next: (response: any) => {
      console.log('API RESPONSE:', response);

      if (response?.success) {
        alert('Career Visualization submitted successfully!');

        console.log(
          'Registration ID:',
          response?.data?.registration_id
        );
      } else {
        console.warn('API returned unsuccessful response:', response);
        alert(
          response?.message ||
          'Career Visualization submission was not successful.'
        );
      }
    },

    error: (error: any) => {
      console.error('========== API ERROR ==========');
      console.error('Status:', error?.status);
      console.error('Status Text:', error?.statusText);
      console.error('Message:', error?.message);
      console.error(
        'ERROR BODY JSON:',
        JSON.stringify(error?.error, null, 2)
      );
      console.error(
        'FULL ERROR JSON:',
        JSON.stringify(error, null, 2)
      );
      console.error('Full Error:', error);
      console.error('================================');

      const errorMessage =
        error?.error?.detail ||
        error?.error?.message ||
        error?.message ||
        'Unable to submit Career Visualization. Please try again.';

      alert(
        `Submit failed. Status: ${error?.status || 'Unknown'}\n${errorMessage}`
      );
    }
  });

}

  // =========================================
  // EVERYTHING VALID
  // =========================================


  selectedVideo: number | null = null;

  


  // ================= PREVIEW MODALS =================



  playVideo(videoNumber: number): void {

    this.selectedVideo = videoNumber;

    console.log(
      'Selected Career Video:',
      videoNumber
    );

  }


  onCareerChange(
  event: Event,
  index: number
): void {

  const select =
    event.target as HTMLSelectElement;

  const story = this.stories[index];

  story.career = select.value;

  if (story.career !== 'Others') {
    story.otherCareer = '';
  }

  story.samePersonValidated = false;

  this.cdr.detectChanges();
}


onVoiceSelected(event: Event, index: number): void {

  const story = this.stories[index];

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const allowedTypes = [
    'audio/mpeg',
    'audio/wav',
    'audio/mp4',
    'audio/x-m4a'
  ];

  const maxSize = 10 * 1024 * 1024; // 10 MB

  // =========================================
  // FILE TYPE
  // =========================================

  if (!allowedTypes.includes(file.type)) {

    alert(
      'Please select MP3, WAV or M4A audio only.'
    );

    input.value = '';

    story.voice = null;
    story.voicePreview = '';

    return;
  }

  // =========================================
  // FILE SIZE
  // =========================================

  if (file.size > maxSize) {

    alert(
      'Audio size must be less than 10 MB.'
    );

    input.value = '';

    story.voice = null;
    story.voicePreview = '';

    return;
  }

  // =========================================
  // VALID VOICE
  // =========================================

  story.voice = file;
  story.voicePreview = file.name;

  // New voice means previous same-person state
  // does not need to be affected, but keep story state clean.
  story.samePersonValidated = false;

  this.cdr.detectChanges();

  console.log(
    `Valid Student Voice - Story ${index + 1}:`,
    file.name
  );
}

 // ================= FullBodyImage =================
onFullBodyImageSelected(
  event: Event,
  index: number
): void {

  const story = this.stories[index];

  const input =
    event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {

    alert(
      'Please upload JPG, PNG or WebP image only.'
    );

    input.value = '';
    story.fullBodyImage = null;
    story.fullBodyPreview = '';
    story.fullBodyValid = false;

    return;
  }

  if (file.size > maxSize) {

    alert(
      'Image size must be less than 5 MB.'
    );

    input.value = '';
    story.fullBodyImage = null;
    story.fullBodyPreview = '';
    story.fullBodyValid = false;

    return;
  }

  if (!this.poseLandmarker) {

    alert(
      'Body detection is still loading. Please wait a moment and upload again.'
    );

    input.value = '';
    return;
  }

  const image = new Image();
  const imageUrl = URL.createObjectURL(file);

  image.onload = () => {

    try {

      const result =
        this.poseLandmarker.detect(image);

      if (
        !result.landmarks ||
        result.landmarks.length === 0
      ) {

        alert(
          'No person detected.\n\n' +
          'Please upload a clear full body image.'
        );

        input.value = '';
        story.fullBodyImage = null;
        story.fullBodyPreview = '';
        story.fullBodyValid = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      const landmarks =
        result.landmarks[0];

      const nose = landmarks[0];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      const leftKnee = landmarks[25];
      const rightKnee = landmarks[26];
      const leftAnkle = landmarks[27];
      const rightAnkle = landmarks[28];

      const requiredPoints = [
        nose,
        leftShoulder,
        rightShoulder,
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle
      ];

      const allVisible =
        requiredPoints.every(point =>
          point &&
          (point.visibility ?? 0) >= 0.5
        );

      if (!allVisible) {

        alert(
          'Please upload a complete Full Body image.\n\n' +
          'Head, shoulders, hips, knees and both feet must be clearly visible.'
        );

        input.value = '';
        story.fullBodyImage = null;
        story.fullBodyPreview = '';
        story.fullBodyValid = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // Standing check
      const hipY =
        (leftHip.y + rightHip.y) / 2;

      const kneeY =
        (leftKnee.y + rightKnee.y) / 2;

      const ankleY =
        (leftAnkle.y + rightAnkle.y) / 2;

      const properStandingPosition =
        hipY < kneeY &&
        kneeY < ankleY;

      function calculateAngle(
        a: any,
        b: any,
        c: any
      ): number {

        const ab = {
          x: a.x - b.x,
          y: a.y - b.y
        };

        const cb = {
          x: c.x - b.x,
          y: c.y - b.y
        };

        const dot =
          ab.x * cb.x +
          ab.y * cb.y;

        const magnitude =
          Math.sqrt(
            ab.x ** 2 +
            ab.y ** 2
          ) *
          Math.sqrt(
            cb.x ** 2 +
            cb.y ** 2
          );

        if (magnitude === 0) {
          return 0;
        }

        return Math.acos(
          Math.max(
            -1,
            Math.min(
              1,
              dot / magnitude
            )
          )
        ) * (180 / Math.PI);
      }

      const leftKneeAngle =
        calculateAngle(
          leftHip,
          leftKnee,
          leftAnkle
        );

      const rightKneeAngle =
        calculateAngle(
          rightHip,
          rightKnee,
          rightAnkle
        );

      const properLegPosition =
        leftKneeAngle >= 145 &&
        rightKneeAngle >= 145;

      if (
        !properStandingPosition ||
        !properLegPosition
      ) {

        alert(
          'Please upload a standing Full Body image.\n\n' +
          'The person must be standing straight.\n' +
          'Sitting or crouching is not allowed.'
        );

        input.value = '';
        story.fullBodyImage = null;
        story.fullBodyPreview = '';
        story.fullBodyValid = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // Edge check
      const bodyPoints =
        requiredPoints.filter(
          point => point != null
        );

      const minX = Math.min(
        ...bodyPoints.map(p => p.x)
      );

      const maxX = Math.max(
        ...bodyPoints.map(p => p.x)
      );

      const minY = Math.min(
        ...bodyPoints.map(p => p.y)
      );

      const maxY = Math.max(
        ...bodyPoints.map(p => p.y)
      );

      const edgeMargin = 0.04;

      const touchingEdge =
        minX < edgeMargin ||
        maxX > 1 - edgeMargin ||
        minY < edgeMargin ||
        maxY > 1 - edgeMargin;

      if (touchingEdge) {

        alert(
          'Please upload the correct frame.\n\n' +
          'Your complete body must be inside the image.'
        );

        input.value = '';
        story.fullBodyImage = null;
        story.fullBodyPreview = '';
        story.fullBodyValid = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // VALID
      story.fullBodyImage = file;
      story.fullBodyPreview = imageUrl;
      story.fullBodyValid = true;

      story.samePersonValidated = false;

      this.cdr.detectChanges();

      console.log(
        `Valid Full Body image - Story ${index + 1}:`,
        file.name
      );

    } catch (error) {

      console.error(
        'Full body detection error:',
        error
      );

      input.value = '';
      story.fullBodyImage = null;
      story.fullBodyPreview = '';
      story.fullBodyValid = false;

      URL.revokeObjectURL(imageUrl);

      alert(
        'Unable to check this image. Please try another image.'
      );
    }
  };

  image.onerror = () => {

    input.value = '';

    story.fullBodyImage = null;
    story.fullBodyPreview = '';
    story.fullBodyValid = false;

    URL.revokeObjectURL(imageUrl);

    alert(
      'Unable to load this image.'
    );
  };

  image.src = imageUrl;
}
// =====================================================
// SHOULDER IMAGE UPLOAD
// =====================================================

onShoulderImageSelected(
  event: Event,
  index: number
): void{
 const story = this.stories[index];
  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  const maxSize = 5 * 1024 * 1024;

  // File type
  if (!allowedTypes.includes(file.type)) {
  alert('Please upload JPG, PNG or WebP image only.');
  input.value = '';

  story.shoulderImage = null;
  story.shoulderPreview = '';
  story.shoulderValid = false;
  story.samePersonValidated = false;

  return;
}


  // File size
  if (file.size > maxSize) {

    alert('Image size must be less than 5 MB.');

  input.value = '';

  story.shoulderImage = null;
  story.shoulderPreview = '';
  story.shoulderValid = false;
  story.samePersonValidated = false;

  return;
}


  // MediaPipe check
  if (!this.poseLandmarker) {

    alert(
      'Body detection is still loading. Please wait a moment and upload again.'
    );

    input.value = '';
    return;
  }

  const image = new Image();
  const imageUrl = URL.createObjectURL(file);

  image.onload = () => {

    try {

      const result = this.poseLandmarker.detect(image);

      if (
        !result.landmarks ||
        result.landmarks.length === 0
      ) {

        alert(
          'No person detected.\n\n' +
          'Please upload a clear Up-to-Shoulder image.'
        );

        input.value = '';
        story.shoulderPreview = '';
        story.shoulderValid = false;
        story.shoulderImage = null;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      const landmarks = result.landmarks[0];

      // Important points
      const nose = landmarks[0];

      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];

      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      const leftKnee = landmarks[25];
      const rightKnee = landmarks[26];

      const leftAnkle = landmarks[27];
      const rightAnkle = landmarks[28];


      // ------------------------------------------------
      // 1. HEAD + BOTH SHOULDERS MUST BE VISIBLE
      // ------------------------------------------------

      const upperBodyVisible =
        nose &&
        leftShoulder &&
        rightShoulder &&
        (nose.visibility ?? 0) >= 0.5 &&
        (leftShoulder.visibility ?? 0) >= 0.5 &&
        (rightShoulder.visibility ?? 0) >= 0.5;


      if (!upperBodyVisible) {

        alert(
          'Please upload an Up-to-Shoulder image.\n\n' +
          'Head and both shoulders must be clearly visible.'
        );

        input.value = '';
        story.shoulderPreview = '';
        story.shoulderValid = false;
        story.shoulderImage = null;

        URL.revokeObjectURL(imageUrl);

        return;
      }


      // ------------------------------------------------
      // 2. REJECT FULL BODY IMAGE
      // ------------------------------------------------

      const lowerBodyPoints = [
        leftHip,
        rightHip,
        leftKnee,
        rightKnee,
        leftAnkle,
        rightAnkle
      ];

      const lowerBodyVisible =
        lowerBodyPoints.filter(point =>
          point &&
          (point.visibility ?? 0) >= 0.55
        ).length;


      // If hips + knees/ankles are visible,
      // this is most likely a full body image.
      if (lowerBodyVisible >= 3) {

        alert(
          '❌ Full Body image is not allowed here.\n\n' +
          'Please upload an image from head to shoulders only.'
        );

        input.value = '';
        story.shoulderPreview = '';
        story.shoulderValid = false;
        story.shoulderImage = null;

        URL.revokeObjectURL(imageUrl);

        return;
      }


      // ------------------------------------------------
      // 3. CHECK SHOULDER POSITION
      // ------------------------------------------------

      const shoulderY =
        (leftShoulder.y + rightShoulder.y) / 2;

      const noseY = nose.y;


      // Shoulders should be below the head
      if (shoulderY <= noseY) {

        alert(
          'Please upload a proper Up-to-Shoulder image.\n\n' +
          'Both shoulders must be visible below the head.'
        );

        input.value = '';
        story.shoulderPreview = '';
        story.shoulderValid = false;
        story.shoulderImage = null;

        URL.revokeObjectURL(imageUrl);

        return;
      }


      // ------------------------------------------------
      // 4. IMAGE ASPECT RATIO
      // ------------------------------------------------

      const ratio = image.width / image.height;

      if (ratio < 0.45 || ratio > 1.15) {

        alert(
          'Please upload a proper Up-to-Shoulder image.\n\n' +
          'Use a portrait or square image showing the head and shoulders.'
        );

        input.value = '';
        story.shoulderPreview = '';
        story.shoulderValid = false;
        story.shoulderImage = null;

        URL.revokeObjectURL(imageUrl);

        return;
      }


      // ------------------------------------------------
      // VALID SHOULDER IMAGE
      // ------------------------------------------------

     story.shoulderImage = file;

      story.shoulderPreview = imageUrl;

      story.shoulderValid = true;
      story.samePersonValidated = false;
      this.cdr.detectChanges();

      console.log(
        'Valid Up-to-Shoulder image:',
        file.name
      );

    } catch (error) {

      console.error(
        'Shoulder image detection error:',
        error
      );

      alert(
        'Unable to check this image. Please try another image.'
      );

      input.value = '';
      story.shoulderPreview = '';
      story.shoulderValid = false;
      story.shoulderImage = null;

      URL.revokeObjectURL(imageUrl);
    }
  };

  image.onerror = () => {

    alert(
      'Unable to load this image. Please select another image.'
    );

    input.value = '';
    story.shoulderPreview = '';
    story.shoulderValid = false;
    story.shoulderImage = null;

    URL.revokeObjectURL(imageUrl);
  };

  image.src = imageUrl;
}


// =====================================================
// FACE IMAGE UPLOAD
// =====================================================

onFaceImageSelected(
  event: Event,
  index: number
): void {

  const story = this.stories[index];

  const input = event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  const maxSize = 5 * 1024 * 1024;

  // ================= FILE TYPE =================

  if (!allowedTypes.includes(file.type)) {

    alert(
      'Please upload JPG, PNG or WebP image only.'
    );

    input.value = '';
    story.facePreview = '';
    story.faceValid = false;
    story.faceImage = null;
    story.samePersonValidated = false;

    return;
  }

  // ================= FILE SIZE =================

  if (file.size > maxSize) {

    alert(
      'Image size must be less than 5 MB.'
    );

    input.value = '';
   story.facePreview = '';
   story.faceValid = false;
   story.faceImage = null;
   story.samePersonValidated = false;

    return;
  }

  // ================= FACE DETECTOR =================

  if (!this.faceDetector) {

    alert(
      'Face detection is still loading.\n\n' +
      'Please wait a moment and upload again.'
    );

    input.value = '';
    story.facePreview = '';
    story.faceValid = false;
    story.faceImage = null;
    story.samePersonValidated = false;

    return;
  }

  const image = new Image();

  image.onload = () => {

    const imageUrl = URL.createObjectURL(file);

    try {

      // ================= IMAGE RATIO =================

      const ratio =
        image.width / image.height;

      /*
        Face image should be close-up.

        Extremely wide images are rejected.
      */

      if (ratio < 0.65 || ratio > 1.35) {

        alert(
          '❌ Please upload a proper Zooming Face image.\n\n' +
          'Only face and a small amount of neck should be visible.'
        );

        input.value = '';
        story.facePreview = '';
        story.faceValid = false;
        story.faceImage = null;
        story.samePersonValidated = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // ================= FACE DETECTION =================

      const result =
        this.faceDetector.detect(image);

      if (
        !result.detections ||
        result.detections.length === 0
      ) {

        alert(
          '❌ No face detected.\n\n' +
          'Please upload a clear close-up face image.'
        );

        input.value = '';
        story.facePreview = '';
        story.faceValid = false;
        story.faceImage = null;
        story.samePersonValidated = false;
        URL.revokeObjectURL(imageUrl);

        return;
      }
      

      // First detected face
      const detection =
        result.detections[0];

      const box =
        detection.boundingBox;

      if (!box) {

        alert(
          'Unable to detect the face properly.\n' +
          'Please upload another image.'
        );

        input.value = '';
        story.facePreview = '';
        story.faceValid = false;
        story.faceImage = null;
        story.samePersonValidated = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // ================= FACE SIZE =================

      const faceWidthRatio =
        box.width / image.width;

      const faceHeightRatio =
        box.height / image.height;

      /*
        Face must be large enough.

        This rejects:
        - full body
        - distant person
        - half body
      */

      if (
        faceWidthRatio < 0.28 ||
        faceHeightRatio < 0.28
      ) {

        alert(
          '❌ Face is too small.\n\n' +
          'Please upload a close-up face image.\n' +
          'Full body or half body images are not allowed.'
        );

        input.value = '';
        story.facePreview = '';
        story.faceValid = false;
        story.faceImage = null;
        story.samePersonValidated = false;

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // ================= FACE POSITION =================

      const faceTop =
        box.originY / image.height;

      const faceBottom =
        (box.originY + box.height) /
        image.height;

      /*
        Face should be in upper/middle area.

        If face is extremely low,
        image is probably not a proper
        face zooming frame.
      */

      if (
       faceTop > 0.35 ||
       faceBottom < 0.58 ||
       faceBottom > 0.82
      ) {

        alert(
          '❌ Please upload a proper Zooming Face image.\n\n' +
          'Face should be clearly visible in the upper part of the image.'
        );

        input.value = '';
        story.facePreview = '';
        story.faceValid = false;
        story.faceImage = null;
        story.samePersonValidated = false;
        

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // ================= FACE ACCEPTED =================

      story.faceImage = file;
      story.facePreview = URL.createObjectURL(file);
      story.faceValid = true;
      story.samePersonValidated = false;

      this.cdr.detectChanges();

      URL.revokeObjectURL(imageUrl);

      console.log(
        'Valid Zooming Face image:',
        file.name
      );

    } catch (error) {

      console.error(
        'Face detection error:',
        error
      );

      input.value = '';
      story.facePreview = '';
      story.faceValid = false;
      story.faceImage = null;
      story.samePersonValidated = false;

      URL.revokeObjectURL(imageUrl);

      alert(
        'Unable to process this image. Please try another image.'
      );
    }
  };

  image.onerror = () => {

    alert(
      'Unable to read this image. Please select another image.'
    );

    input.value = '';
     story.facePreview = '';
     story.faceValid = false;
     story.faceImage = null;
     story.samePersonValidated = false;
  };

  image.src =
    URL.createObjectURL(file);
}

// =====================================================
// FULL BODY - PREVIEW / DELETE
// =====================================================

viewFullBodyPreview(index: number): void {
  const story = this.stories[index];

  if (story.fullBodyPreview) {
    this.fullBodyPreview = story.fullBodyPreview;
    this.showFullBodyPreview = true;
  }
}

closeFullBodyPreview(): void {

  this.showFullBodyPreview = false;

}

deleteFullBodyImage(
  index: number,
  input: HTMLInputElement
): void {
  const story = this.stories[index];

  input.value = '';

  story.fullBodyImage = null;
  story.fullBodyPreview = '';
  story.fullBodyValid = false;
  story.samePersonValidated = false;

  this.fullBodyPreview = '';
  this.fullBodyMessage = '';
  this.showFullBodyPreview = false;

  console.log(
    `Full Body image deleted from Story ${index + 1}`
  );
}


// =====================================================
// SHOULDER - PREVIEW / DELETE
// =====================================================

viewShoulderPreview(index: number): void {
  const story = this.stories[index];

  if (story.shoulderPreview) {
    this.shoulderPreview = story.shoulderPreview;
    this.showShoulderPreview = true;
  }
}

closeShoulderPreview(): void {

  this.showShoulderPreview = false;

}

deleteShoulderImage(
  index: number,
  input: HTMLInputElement
): void {

  const story = this.stories[index];

  input.value = '';

  story.shoulderImage = null;
  story.shoulderPreview = '';
  story.shoulderValid = false;
  story.samePersonValidated = false;

  this.showShoulderPreview = false;

  this.cdr.detectChanges();

  console.log(
    `Shoulder image deleted from Story ${index + 1}`
  );
}


// =====================================================
// FACE - PREVIEW / DELETE
// =====================================================

viewFacePreview(index: number): void {
  const story = this.stories[index];

  if (story.facePreview) {
    this.facePreview = story.facePreview;
    this.showFacePreview = true;
  
  }
}

closeFacePreview(): void {
  this.showFacePreview = false;
}

deleteFaceImage(
  index: number,
  input: HTMLInputElement
): void {
  const story = this.stories[index];

  input.value = '';

  story.faceImage = null;
  story.facePreview = '';
  story.faceValid = false;
  story.samePersonValidated = false;

  this.showFacePreview = false;

  console.log(
    `Face image deleted from Story ${index + 1}`
  );
}
}