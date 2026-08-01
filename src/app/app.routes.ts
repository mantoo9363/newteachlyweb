import { Routes } from '@angular/router';
import { HomePageComponent } from './presentation/pages/home/home.component';
import { SimulatorComponent } from './presentation/pages/simulator/simulator.component';
import { SimulatorDetailComponent } from './presentation/pages/simulator-detail/simulator-detail.component';
import { CurriculumDetailsComponent } from './presentation/pages/curriculum-details/curriculum-details.component';
import { TutorialDetailComponent } from './presentation/pages/tutorial-detail/tutorial-detail.component';
import { AboutUsComponent } from './presentation/pages/about-us/about-us.component';
import { CognitiveSkillProfileComponent } from './presentation/pages/cognitive-skill-profile/cognitive-skill-profile.component';
import { ChildPsychologyComponent } from './presentation/pages/child-psychology/child-psychology.component';
import { IframeViewComponent } from './presentation/pages/iframe-view/iframe-view.component';
import { PrivacyPolicyComponent } from './presentation/pages/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './presentation/pages/terms-of-service/terms-of-service.component';
import { CtAiComponent } from './presentation/pages/ct-ai/ct-ai.component';
import { ResetPasswordComponent } from './presentation/pages/reset-password/reset-password.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Teachly | Interactive STEM Simulations & Learning Platform'
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    title: 'Teachly | Reset Password'
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    title: 'Teachly | Reset Password'
  },
  {
    path: 'simulator',
    component: SimulatorComponent,
    canActivate: [authGuard],
    title: 'Teachly | STEM virtual lab - Physics, Chemistry, Biology & Math'
  },

   {
    path: 'ctai',
    component: CtAiComponent,
    canActivate: [authGuard],
    title: 'Teachly | CT-AI'
  },
  {
    path: 'view-simulator/:id',
    component: SimulatorDetailComponent,
    canActivate: [authGuard],
    title: 'Teachly | Interactive Simulation Detail'
  },
  {
    // TODO: re-add canActivate: [authGuard] once tutorial preview/review is done
    path: 'curriculum-details',
    component: CurriculumDetailsComponent,
    title: 'Teachly | Curriculum Details'
  },
  {
    // TODO: re-add canActivate: [authGuard] once tutorial preview/review is done
    path: 'tutorial/category/:category',
    component: TutorialDetailComponent,
    title: 'Teachly | Tutorial'
  },
  {
    // TODO: re-add canActivate: [authGuard] once tutorial preview/review is done
    path: 'tutorial/:id',
    component: TutorialDetailComponent,
    title: 'Teachly | Tutorial'
  },
  {
    path: 'iframe-view',
    component: IframeViewComponent,
    canActivate: [authGuard],
    title: 'Teachly | External Content'
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    title: 'Teachly | About Us'
  },
  {
    path: 'cognitive-skill-profile',
    component: CognitiveSkillProfileComponent,
    title: 'Teachly | Cognitive Skill Profile'
  },
  {
    path: 'child-psychology',
    component: ChildPsychologyComponent,
    title: 'Teachly | Child Psychology'
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    title: 'Teachly | Privacy Policy'
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
    title: 'Teachly | Terms of Service'
  },
  {
    path: '**',
    redirectTo: '',
  },
];
