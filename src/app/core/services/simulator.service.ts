
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Simulator {
  id: string;
  name: string;
  thumbnail: string;
  url: string;
  category: string;
  subject: string;
  classes: string[];
  isNew?: boolean;
  videoUrl?: string;      // Default video
  videoUrls?: {
    '1-5'?: string;
    '6-10'?: string;
    '11-university'?: string;
  };
  availableLanguages?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private simulators: Simulator[] = [
   {
  id: 'area-builder',
  name: 'Area Builder',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/area-builder-420.png',
  url: '/virtual_lab/area-builder_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['3', '4', '5'],
  isNew: true,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
},
{
  id: 'acid-base-solutions',
  name: 'Acid-Base Solutions',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/acid-base-solutions-420.png',
  url: '/virtual_lab/acid-base-solutions_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['10', '11', '12'],
  isNew: true,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Acid-Base 6 to 10.mp4'
},
{
  id: 'area-model-decimals',
  name: 'Area Model: Decimals',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/area-model-decimals-420.png',
  url: '/virtual_lab/area-model-decimals_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['5', '6'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA MODEL DECIMALS.mp4'
},
{
  id: 'balancing-chemical-equations',
  name: 'Balancing Chemical Equations',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/balancing-chemical-equations-420.png',
  url: '/virtual_lab/balancing-chemical-equations_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['9', '10', '11'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/BALANCING CHEMICAL EQUATIONS.mp4'
},
{
  id: 'beers-law-lab',
  name: "Beer's Law Lab",
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/beers-law-lab-420.png',
  url: '/virtual_lab/beers-law-lab_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrls: {
    '6-10': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/beers law lab 1.mp4',
    '11-university': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/beers law lab 2.mp4'
  }
},
{
  id: 'build-a-fraction',
  name: 'Build a Fraction',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/build-a-fraction-420.png',
  url: '/virtual_lab/beers-law-lab_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['3', '4', '5'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/build a fraction.mp4'
},
{
  id: 'build-a-molecule',
  name: 'Build a Molecule',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/build-a-molecule-420.png',
  url: '/virtual_lab/build-a-molecule_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: [],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/BUILD A MOLECULE.mp4'
},
{
  id: 'concentration',
  name: 'Concentration',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/concentration-420.png',
  url: '/virtual_lab/concentration_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['9', '10', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/CONCENTRATION.mp4'
},
{
  id: 'diffusion',
  name: 'Diffusion',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/diffusion-420.png',
  url: '/virtual_lab/diffusion_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['9', '10', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/diffusion.mp4'
},
{
  id: 'equality-explorer',
  name: 'Equality Explorer',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/equality-explorer-420.png',
  url: '/virtual_lab/equality-explorer_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['7', '8', '9'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Equality explorer 6-10.mp4'
},
{
  id: 'expression-exchange',
  name: 'Expression Exchange',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/expression-exchange-420.png',
  url: '/virtual_lab/expression-exchange_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['7', '8'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/EXPRESSION CHANGE.mp4'
},
{
  id: 'function-builder',
  name: 'Function Builder',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/function-builder-420.png',
  url: '/virtual_lab/function-builder_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['9', '10', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/function builder 6-10.mp4'
},
{
  id: 'graphing-lines',
  name: 'Graphing Lines',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/graphing-lines-420.png',
  url: '/virtual_lab/graphing-lines_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['9', '10'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/GRAPHING LINES.mp4'
},
{
  id: 'graphing-quadratics',
  name: 'Graphing Quadratics',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/graphing-quadratics-420.png',
  url: '/virtual_lab/graphing-quadratics_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['10', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/GRAPHING LINES 2.mp4'
},
{
  id: 'molecule-polarity',
  name: 'Molecule Polarity',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/molecule-polarity-420.png',
  url: '/virtual_lab/molecule-polarity_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Molecules & light.mp4'
},
{
  id: 'molecule-shapes',
  name: 'Molecule Shapes',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/molecule-shapes-420.png',
  url: '/virtual_lab/molecule-shapes_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/molecu;e shapes.mp4'
},
// {
//   id: 'molecule-shapes-basics',
//   name: 'Molecule Shapes: Basics',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/molecule-shapes-basics-420.png',
//   url: '/virtual_lab/molecule-shapes-basics_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['10', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'neuron',
  name: 'Neuron',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/balancing-chemical-equations-420.png',
  url: '/virtual_lab/neuron_en.html',
  category: 'Biology',
  subject: 'Biology',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Neuron 6 to 10.mp4'
},
{
  id: 'number-line-integers',
  name: 'Number Line: Integers',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/neuron-420.png',
  url: '/virtual_lab/number-line-integers_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['6', '7'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/NUMBER LINES INTEGER.mp4'
  
},
{
  id: 'number-line-operations',
  name: 'Number Line: Operations',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/number-line-integers-420.png',
  url: '/virtual_lab/number-line-operations_all.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['7', '8'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/number line - operations 6-10.mp4'
},
{
  id: 'ohms-law',
  name: "Ohm's Law",
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/ohms-law-420.png',
  url: '/virtual_lab/ohms-law_en.html',
  category: 'Physics',
  subject: 'Electricity, Magnets & Circuits',
  classes: ['10', '11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrls: {
    '6-10': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/ohms law 1.mp4',
    '11-university': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/ohms law 2.mp4'
  }
},
// {
//   id: 'pendulum-lab',
//   name: 'Pendulum Lab',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/pendulum-lab-420.png',
//   url: '/virtual_lab/pendulum-lab_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['7', '8', '9'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'ph-scale',
//   name: 'pH Scale',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/ph-scale-420.png',
//   url: '/virtual_lab/ph-scale_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/ph scale 6-10.mp4'
// },
{
  id: 'ph-scale-basics',
  name: 'pH Scale: Basics',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/ph-scale-basics-420.png',
  url: '/virtual_lab/ph-scale-basics_en.html',
  category: 'Chemistry',
  subject: 'General Chemistry',
  classes: ['7', '8', '9'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/ph scale 6-10.mp4'
},
// {
//   id: 'projectile-motion',
//   name: 'Projectile Motion',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/projectile-motion-420.png',
//   url: '/virtual_lab/projectile-motion_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'resistance-in-a-wire',
//   name: 'Resistance in a Wire',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/resistance-in-a-wire-420.png',
//   url: '/virtual_lab/resistance-in-a-wire_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'rutherford-scattering',
//   name: 'Rutherford Scattering',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/rutherford-scattering-420.png',
//   url: '/virtual_lab/concentration_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'states-of-matter',
//   name: 'States of Matter',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/states-of-matter-420.png',
//   url: '/virtual_lab/states-of-matter_en.html',
//   category: 'Physics',
//   subject: 'Heat & Thermo',
//   classes: ['7', '8', '9'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/states of matter 6-10.mp4'
// },
{
  id: 'states-of-matter-basics',
  name: 'States of Matter: Basics',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/ph-scale-420.png',
  url: '/virtual_lab/states-of-matter-basics_en.html',
  category: 'Physics',
  subject: 'Heat & Thermo',
  classes: ['5', '6', '7'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/states of matter 6-10.mp4'
},
{
  id: 'trig-tour',
  name: 'Trig Tour',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/trig-tour-420.png',
  url: '/virtual_lab/trig-tour_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['10', '11', '12'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/trig tour 6 to 10.mp4'
},
{
  id: 'wave-interference',
  name: 'Wave Interference',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/wave-interference-420.png',
  url: '/virtual_lab/wave-interference_en.html',
  category: 'Physics',
  subject: 'Sound & Waves',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Wave Interface.mp4'
},
{
  id: 'area-model-multiplication',
  name: 'Area Model: Multiplication',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/area-model-multiplication-420.png',
  url: '/virtual_lab/area-model-multiplication_en.html',
  category: 'Math & Statistics',
  subject: 'Math Concepts',
  classes: ['3', '4', '5'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA MODEL MULTIPLICATION.mp4'
},
// {
//   id: 'mean-share-and-balance',
//   name: 'Mean: Share and Balance',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/mean-share-and-balance-420.png',
//   url: '/virtual_lab/mean-share-and-balance_en.html',
//   category: 'Math & Statistics',
//   subject: 'Math Applications',
//   classes: ['7', '8', '9'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'models-of-the-hydrogen-atom',
//   name: 'Models of the Hydrogen Atom',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/models-of-the-hydrogen-atom-420.png',
//   url: '/virtual_lab/models-of-the-hydrogen-atom_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'my-solar-system',
  name: 'My Solar System',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/my-solar-system-420.png',
  url: '/virtual_lab/my-solar-system_en.html',
  category: 'Earth & Space',
  subject: 'Earth & Space',
  classes: ['9', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/my solar system.mp4'
},
// {
//   id: 'quantum-coin-toss',
//   name: 'Quantum Coin Toss',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/quantum-coin-toss-420.png',
//   url: '/virtual_lab/quantum-coin-toss_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: [],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'quantum-measurement',
//   name: 'Quantum Measurement',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/quantum-measurement-420.png',
//   url: '/virtual_lab/quantum-measurement_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: [],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
// {
//   id: 'buoyancy-basics',
//   name: 'Buoyancy: Basics',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/buoyancy-basics-420.png',
//   url: '/virtual_lab/buoyancy-basics_en.htmll',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: [],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'circuit-construction-kit-dc',
  name: 'Circuit Construction Kit: DC',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/circuit-construction-kit-dc-420.png',
  url: '/virtual_lab/circuit-construction-kit-dc_en.html',
  category: 'Physics',
  subject: 'Electricity, Magnets & Circuits',
  classes: ['6', '7', '8', '9', '10'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Circuit construction kit;DC 6 to 12.mp4'
},
// {
//   id: 'circuit-construction-kit-dc-virtual-lab',
//   name: 'Circuit Construction Kit: DC - Virtual Lab',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/circuit-construction-kit-dc-virtual-lab-420.png',
//   url: '/virtual_lab/concentration_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'color-vision',
  name: 'Color Vision',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/color-vision-420.png',
  url: '/virtual_lab/color-vision_en.html',
  category: 'Physics',
  subject: 'Light & Radiation',
  classes: ['10', '11', '12'],
  isNew: true,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/COLOR VISION 2.mp4'
},
{
  id: 'density',
  name: 'Density',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/density-420.png',
  url: '/virtual_lab/density_en.html',
  category: 'Physics',
  subject: 'Motion',
  classes: [],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Density 6 to 10'
},
{
  id: 'energy-skate-park',
  name: 'Energy Skate Park',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/energy-skate-park-420.png',
  url: '/virtual_lab/energy-skate-park_en.html',
  category: 'Physics',
  subject: 'Work, Energy & Power',
  classes: ['9', '10', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrls: {
    '6-10': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Energy scate park (1) 5 to 8.mp4',
    '11-university': 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/Energy scate park (2) 5 to 8.mp4'
  }
},
{
  id: 'faradays-law',
  name: "Faraday's Law",
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/faradays-law-420.png',
  url: '/virtual_lab/faradays-law_en.html',
  category: 'Physics',
  subject: 'Electricity, Magnets & Circuits',
  classes: ['12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/faradays law.mp4'
},
// {
//   id: 'forces-and-motion-basics',
//   name: 'Forces and Motion: Basics',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/forces-and-motion-basics-420.png',
//   url: '/virtual_lab/forces-and-motion-basics_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['6', '7', '8'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'fourier-making-waves',
  name: 'Fourier: Making Waves',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/fourier-making-waves-420.png',
  url: '/virtual_lab/fourier-making-waves_en.html',
  category: 'Physics',
  subject: 'Sound & Waves',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en']//,
  //videoUrl: '/video/Simulators/AREA BUILDER.mp4'
},
{
  id: 'gas-properties',
  name: 'Gas Properties',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/gas-properties-420.png',
  url: '/virtual_lab/gas-properties_en.html',
  category: 'Physics',
  subject: 'Heat & Thermo',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/gas properties 2.mp4'
},
// {
//   id: 'gravity-and-orbits',
//   name: 'Gravity and Orbits',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/gravity-and-orbits-420.png',
//   url: '/virtual_lab/gravity-and-orbits_en.html',
//   category: 'Earth & Space',
//   subject: 'Earth & Space',
//   classes: ['9', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'gravity-force-lab',
  name: 'Gravity Force Lab',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/gravity-force-lab-420.png',
  url: '/virtual_lab/gravity-force-lab_en.html',
  category: 'Physics',
  subject: 'Motion',
  classes: ['9', '11'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/gravity force lab 6-10.mp4'
},
// {
//   id: 'hookes-law',
//   name: "Hooke's Law",
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/hookes-law-420.png',
//   url: '/virtual_lab/hookes-law_en.html',
//   category: 'Physics',
//   subject: 'Work, Energy & Power',
//   classes: ['10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },
{
  id: 'john-travoltage',
  name: 'John Travoltage',
  thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/john-travoltage-420.png',
  url: '/virtual_lab/john-travoltage_en.html',
  category: 'Physics',
  subject: 'Electricity, Magnets & Circuits',
  classes: ['8', '9', '10'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/john travoltage 1-5.mp4'
},
// {
//   id: 'magnets-and-electromagnets',
//   name: 'Magnets and Electromagnets',
//   thumbnail: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators_Thumbnail/magnets-and-electromagnets-420.png',
//   url: '/virtual_lab/magnets-and-electromagnets_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/uploads/videos/Simulators/AREA BUILDER.mp4'
// },


//  {
//    id: 'make-a-ten',
//    name: 'Make a Ten',
//    thumbnail: '/video/Simulators_Thumbnail/make-a-ten-420.png',
//    url: '/virtual_lab/make-a-ten_en.html',
//    category: 'Math & Statistics',
//    subject: 'Mathematics',
//    classes: ['1', '2', '3'],
//    isNew: false,
//    availableLanguages: ['en', 'ur'],
//    videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/MAKE A TEN.mp4'
//  },
//  {
//    id: 'number-play',
//    name: 'Number Play',
//    thumbnail: '/video/Simulators_Thumbnail/number-play-420.png',
//    url: '/virtual_lab/number-play_en.html',
//    category: 'Math & Statistics',
//    subject: 'Mathematics',
//    classes: ['1', '2', '3'],
//    isNew: false,
//    availableLanguages: ['en', 'ur'],
//    videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/NUMBER PLAY.mp4'
//  },
 {
   id: 'arithmetic',
   name: 'Arithmetic',
   thumbnail: '/video/Simulators_Thumbnail/arithmetic-420.png',
   url: '/virtual_lab/arithmetic_en.html',
   category: 'Math & Statistics',
   subject: 'Mathematics',
   classes: ['1', '2', '3'],
   isNew: false,
   availableLanguages: ['en', 'ur'],
   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/Arithmetic 1-5.mp4'
 },
 {
   id: 'fractions-intro',
   name: 'Fractions: Intro',
   thumbnail: '/video/Simulators_Thumbnail/fractions-intro-420.png',
   url: '/virtual_lab/fractions-intro_en.html',
   category: 'Math & Statistics',
   subject: 'Mathematics',
   classes: ['3', '4', '5'],
   isNew: false,
   availableLanguages: ['en', 'ur'],
   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FRACTIONS INTRO.mp4'
 },
 {
   id: 'fractions-equality',
   name: 'Fractions: Equality',
   thumbnail: '/video/Simulators_Thumbnail/fractions-equality-420.png',
   url: '/virtual_lab/fractions-equality_en.html',
   category: 'Math & Statistics',
   subject: 'Mathematics',
   classes: ['4', '5', '6'],
   isNew: false,
   availableLanguages: ['en', 'ur'],
   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FRACTIONS EQUALITY.mp4'
 },
 {
   id: 'fraction-matcher',
   name: 'Fraction Matcher',
   thumbnail: '/video/Simulators_Thumbnail/fraction-matcher-420.png',
   url: '/virtual_lab/fraction-matcher_en.html',
   category: 'Math & Statistics',
   subject: 'Mathematics',
   classes: ['4', '5', '6'],
   isNew: false,
   availableLanguages: ['en', 'ur'],
   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FRACTION MATCHER.mp4'
 },
// {
//   id: 'energy-forms-and-changes',
//   name: 'Energy Forms and Changes',
//   thumbnail: '/video/Simulators_Thumbnail/energy-forms-and-changes-420.png',
//   url: '/virtual_lab/energy-forms-and-changes_en.html',
//   category: 'Physics',
//   subject: 'Science',
//   classes: ['4', '5', '6'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/ENERGY FORMS AND CHANGES.mp4'
// },
// {
//   id: 'balancing-act',
//   name: 'Balancing Act',
//   thumbnail: '/video/Simulators_Thumbnail/balancing-act-420.png',
//   url: '/virtual_lab/balancing-act_en.html',
//   category: 'Physics',
//   subject: 'Science',
//   classes: ['5', '6', '7'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/BALANCING ACT.mp4'
// },
// {
//   id: 'area-model-introduction',
//   name: 'Area Model Introduction',
//   thumbnail: '/video/Simulators_Thumbnail/area-model-introduction-420.png',
//   url: '/virtual_lab/area-model-introduction_en.html',
//   category: 'Math & Statistics',
//   subject: 'Mathematics',
//   classes: ['4', '5'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/AREA MODEL INTRODUCTION.mp4'
// },
// {
//   id: 'fractions-mixed-numbers',
//   name: 'Fractions: Mixed Numbers',
//   thumbnail: '/video/Simulators_Thumbnail/fractions-mixed-numbers-420.png',
//   url: '/virtual_lab/fractions-mixed-numbers_en.html',
//   category: 'Math & Statistics',
//   subject: 'Mathematics',
//   classes: ['5', '6'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FRACTIONS MIXED NUMBERS.mp4'
// },
{
  id: 'ratio-and-proportion',
  name: 'Ratio and Proportion',
  thumbnail: '/video/Simulators_Thumbnail/ratio-and-proportion-420.png',
  url: '/virtual_lab/ratio-and-proportion_en.html',
  category: 'Math & Statistics',
  subject: 'Mathematics',
  classes: ['6', '7', '8'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/ratio_and_proportion_6-10.mp4'
},
// {
//   id: 'proportion-playground',
//   name: 'Proportion Playground',
//   thumbnail: '/video/Simulators_Thumbnail/proportion-playground-420.png',
//   url: '/virtual_lab/proportion-playground_en.html',
//   category: 'Math & Statistics',
//   subject: 'Mathematics',
//   classes: ['6', '7'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/PROPORTION PLAYGROUND.mp4'
// },
 {
    id: 'unit-rates',
   name: 'Unit Rates',
  thumbnail: '/video/Simulators_Thumbnail/unit-rates-420.png',
  url: '/virtual_lab/unit-rates_en.html',
  category: 'Math & Statistics',
  subject: 'Mathematics',
  classes: ['6', '7'],
  isNew: false,
  availableLanguages: ['en'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/UNIT RATES.mp4'
},
// {
//   id: 'number-line-distance',
//   name: 'Number Line: Distance',
//   thumbnail: '/video/Simulators_Thumbnail/number-line-distance-420.png',
//   url: '/virtual_lab/number-line-distance_en.html',
//   category: 'Math & Statistics',
//   subject: 'Mathematics',
//   classes: ['6', '7'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/NUMBER LINE DISTANCE.mp4'
// },
{
  id: 'wave-on-a-string',
  name: 'Wave on a String',
  thumbnail: '/video/Simulators_Thumbnail/wave-on-a-string-420.png',
  url: '/virtual_lab/wave-on-a-string_en.html',
  category: 'Physics',
  subject: 'Science',
  classes: ['7', '8', '9', '10'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/WAVE ON A STRING.mp4'
},
// {
//   id: 'probability',
//   name: 'Probability',
//   thumbnail: '/video/Simulators_Thumbnail/probability-420.png',
//   url: '/virtual_lab/probability_en.html',
//   category: 'Math & Statistics',
//   subject: 'Mathematics',
//   classes: ['7', '8', '9'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/PROBABILITY.mp4'
// },
// {
//   id: 'balloons-and-static-electricity',
//   name: 'Balloons and Static Electricity',
//   thumbnail: '/video/Simulators_Thumbnail/balloons-and-static-electricity-420.png',
//   url: '/virtual_lab/balloons-and-static-electricity_en.html',
//   category: 'Physics',
//   subject: 'Physics',
//   classes: ['8', '9', '10'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/BALLOONS AND STATIC ELECTRICITY.mp4'
// },
// {
//   id: 'bending-light',
//   name: 'Bending Light',
//   thumbnail: '/video/Simulators_Thumbnail/bending-light-420.png',
//   url: '/virtual_lab/bending-light_en.html',
//   category: 'Physics',
//   subject: 'Physics',
//   classes: ['8', '9', '10'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/BENDING LIGHT.mp4'
// },
{
  id: 'build-an-atom',
  name: 'Build an Atom',
  thumbnail: '/video/Simulators_Thumbnail/build-an-atom-420.png',
  url: '/virtual_lab/build-an-atom_en.html',
  category: 'Physics',
  subject: 'Physics',
  classes: ['8', '9', '10', '11'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/BUILD AN ATOM.mp4'
},
// {
//   id: 'masses-and-springs',
//   name: 'Masses and Springs',
//   thumbnail: '/video/Simulators_Thumbnail/masses-and-springs-420.png',
//   url: '/virtual_lab/masses-and-springs_en.html',
//   category: 'Physics',
//   subject: 'Physics',
//   classes: ['8', '9', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/MASSES AND SPRINGS.mp4'
// },
{
  id: 'natural-selection',
  name: 'Natural Selection',
  thumbnail: '/video/Simulators_Thumbnail/natural-selection-420.png',
  url: '/virtual_lab/natural-selection_en.html',
  category: 'Biology',
  subject: 'Biology',
  classes: ['8', '9', '10'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/NATURAL SELECTION.mp4'
},
// {
//   id: 'moving-man',
//   name: 'Moving Man',
//   thumbnail: '/video/Simulators_Thumbnail/moving-man-420.png',
//   url: '/virtual_lab/moving-man_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/MOVING MAN.mp4'
// },
// {
//   id: 'graphing-slope-intercept',
//   name: 'Graphing Slope-Intercept',
//   thumbnail: '/video/Simulators_Thumbnail/graphing-slope-intercept-420.png',
//   url: '/virtual_lab/graphing-slope-intercept_en.html',
//   category: 'Math & Statistics',
//   subject: 'Math Concepts',
//   classes: ['9', '10'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/GRAPHING SLOPE INTERCEPT.mp4'
// },
// {
//   id: 'median',
//   name: 'Median',
//   thumbnail: '/video/Simulators_Thumbnail/median-420.png',
//   url: '/virtual_lab/median_en.html',
//   category: 'Math & Statistics',
//   subject: 'Math Concepts',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/MEDIAN.mp4'
// },
// {
//   id: 'forces-and-motion',
//   name: 'Forces and Motion',
//   thumbnail: '/video/Simulators_Thumbnail/forces-and-motion-420.png',
//   url: '/virtual_lab/forces-and-motion_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FORCES AND MOTION.mp4'
// },
// {
//   id: 'under-pressure',
//   name: 'Under Pressure',
//   thumbnail: '/video/Simulators_Thumbnail/under-pressure-420.png',
//   url: '/virtual_lab/under-pressure_en.html',
//   category: 'Physics',
//   subject: 'Fluid Mechanics',
//   classes: ['8', '9', '10'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/UNDER PRESSURE.mp4'
// },
// {
//   id: 'sound',
//   name: 'Sound',
//   thumbnail: '/video/Simulators_Thumbnail/sound-420.png',
//   url: '/virtual_lab/sound_en.html',
//   category: 'Physics',
//   subject: 'Sound & Waves',
//   classes: ['8', '9'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/SOUND.mp4'
// },
// {
//   id: 'atomic-interactions',
//   name: 'Atomic Interactions',
//   thumbnail: '/video/Simulators_Thumbnail/atomic-interactions-420.png',
//   url: '/virtual_lab/atomic-interactions_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/ATOMIC INTERACTIONS.mp4'
// },
// {
//   id: 'isotopes-and-atomic-mass',
//   name: 'Isotopes and Atomic Mass',
//   thumbnail: '/video/Simulators_Thumbnail/isotopes-and-atomic-mass-420.png',
//   url: '/virtual_lab/isotopes-and-atomic-mass_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/ISOTOPES AND ATOMIC MASS.mp4'
// },
// {
//   id: 'sugar-and-salt-solutions',
//   name: 'Sugar and Salt Solutions',
//   thumbnail: '/video/Simulators_Thumbnail/sugar-and-salt-solutions-420.png',
//   url: '/virtual_lab/sugar-and-salt-solutions_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/SUGAR AND SALT SOLUTIONS.mp4'
// },
// {
//   id: 'glaciers',
//   name: 'Glaciers',
//   thumbnail: '/video/Simulators_Thumbnail/glaciers-420.png',
//   url: '/virtual_lab/glaciers_en.html',
//   category: 'Earth & Space',
//   subject: 'Earth Science',
//   classes: ['9', '10'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/GLACIERS.mp4'
// },
// {
//   id: 'geometric-optics',
//   name: 'Geometric Optics',
//   thumbnail: '/video/Simulators_Thumbnail/geometric-optics-420.png',
//   url: '/virtual_lab/geometric-optics_en.html',
//   category: 'Physics',
//   subject: 'Light & Radiation',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/GEOMETRIC OPTICS.mp4'
// },
{
  id: 'gene-expression-essentials',
  name: 'Gene Expression Essentials',
  thumbnail: '/video/Simulators_Thumbnail/gene-expression-essentials-420.png',
  url: '/virtual_lab/gene-expression-essentials_en.html',
  category: 'Biology',
  subject: 'Biology',
  classes: ['10', '11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: '/video/Simulators/GENE EXPRESSION ESSENTIALS.mp4'
},
// {
//   id: 'greenhouse-effect',
//   name: 'Greenhouse Effect',
//   thumbnail: '/video/Simulators_Thumbnail/greenhouse-effect-420.png',
//   url: '/virtual_lab/greenhouse-effect_en.html',
//   category: 'Physics',
//   subject: 'Heat & Thermo',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/GREENHOUSE EFFECT.mp4'
// },
// {
//   id: 'molecules-and-light',
//   name: 'Molecules and Light',
//   thumbnail: '/video/Simulators_Thumbnail/molecules-and-light-420.png',
//   url: '/virtual_lab/molecules-and-light_en.html',
//   category: 'Physics',
//   subject: 'Light & Radiation',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/MOLECULES AND LIGHT.mp4'
// },
// {
//   id: 'plinko-probability',
//   name: 'Plinko Probability',
//   thumbnail: '/video/Simulators_Thumbnail/plinko-probability-420.png',
//   url: '/virtual_lab/plinko-probability_en.html',
//   category: 'Math & Statistics',
//   subject: 'Math Concepts',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/PLINKO PROBABILITY.mp4'
// },
// {
//   id: 'acid-base-solutions',
//   name: 'Acid-Base Solutions',
//   thumbnail: '/video/Simulators_Thumbnail/acid-base-solutions-420.png',
//   url: '/virtual_lab/acid-base-solutions_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/ACID BASE SOLUTIONS.mp4'
// },
// {
//   id: 'reactants-products-and-leftovers',
//   name: 'Reactants, Products and Leftovers',
//   thumbnail: '/video/Simulators_Thumbnail/reactants-products-and-leftovers-420.png',
//   url: '/virtual_lab/reactants-products-and-leftovers_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/REACTANTS PRODUCTS AND LEFTOVERS.mp4'
// },
// {
//   id: 'salts-and-solubility',
//   name: 'Salts and Solubility',
//   thumbnail: '/video/Simulators_Thumbnail/salts-and-solubility-420.png',
//   url: '/virtual_lab/salts-and-solubility_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['10', '11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/SALTS AND SOLUBILITY.mp4'
// },
// {
//   id: 'molarity',
//   name: 'Molarity',
//   thumbnail: '/video/Simulators_Thumbnail/molarity-420.png',
//   url: '/virtual_lab/molarity_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/MOLARITY.mp4'
// },
{
  id: 'coulombs-law',
  name: "Coulomb's Law",
  thumbnail: '/video/Simulators_Thumbnail/coulombs-law-420.png',
  url: '/virtual_lab/coulombs-law_en.html',
  category: 'Physics',
  subject: 'Electricity, Magnets & Circuits',
  classes: ['11', '12'],
  isNew: false,
  availableLanguages: ['en', 'ur'],
  videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/COULOMBS LAW.mp4'
},
// {
//   id: 'charges-and-fields',
//   name: 'Charges and Fields',
//   thumbnail: '/video/Simulators_Thumbnail/charges-and-fields-420.png',
//   url: '/virtual_lab/charges-and-fields_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/CHARGES AND FIELDS.mp4'
// },
// {
//   id: 'vector-addition',
//   name: 'Vector Addition',
//   thumbnail: '/video/Simulators_Thumbnail/vector-addition-420.png',
//   url: '/virtual_lab/vector-addition_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/VECTOR ADDITION.mp4'
// },
// {
//   id: 'fluid-pressure-and-flow',
//   name: 'Fluid Pressure and Flow',
//   thumbnail: '/video/Simulators_Thumbnail/fluid-pressure-and-flow-420.png',
//   url: '/virtual_lab/fluid-pressure-and-flow_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/FLUID PRESSURE AND FLOW.mp4'
// },
// {
//   id: 'normal-modes',
//   name: 'Normal Modes',
//   thumbnail: '/video/Simulators_Thumbnail/normal-modes-420.png',
//   url: '/virtual_lab/normal-modes_en.html',
//   category: 'Physics',
//   subject: 'Sound & Waves',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/NORMAL MODES.mp4'
// },
// {
//   id: 'calculus-grapher',
//   name: 'Calculus Grapher',
//   thumbnail: '/video/Simulators_Thumbnail/calculus-grapher-420.png',
//   url: '/virtual_lab/calculus-grapher_en.html',
//   category: 'Math & Statistics',
//   subject: 'Calculus',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: 'https://apifuturexcamp.theteachly.com/upload/video/Simulators/CALCULUS GRAPHER.mp4'
// },
// {
//   id: 'curve-fitting',
//   name: 'Curve Fitting',
//   thumbnail: '/video/Simulators_Thumbnail/curve-fitting-420.png',
//   url: '/virtual_lab/curve-fitting_en.html',
//   category: 'Math & Statistics',
//   subject: 'Math Concepts',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/CURVE FITTING.mp4'
// },
// {
//   id: 'least-squares-regression',
//   name: 'Least-Squares Regression',
//   thumbnail: '/video/Simulators_Thumbnail/least-squares-regression-420.png',
//   url: '/virtual_lab/least-squares-regression_en.html',
//   category: 'Math & Statistics',
//   subject: 'Statistics',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/LEAST SQUARES REGRESSION.mp4'
// },
// {
//   id: 'capacitor-lab',
//   name: 'Capacitor Lab',
//   thumbnail: '/video/Simulators_Thumbnail/capacitator-lab-420.png',
//   url: '/virtual_lab/capacitor-lab_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/CAPACITOR LAB.mp4'
// },
// {
//   id: 'capacitor-lab-basics',
//   name: 'Capacitor Lab: Basics',
//   thumbnail: '/video/Simulators_Thumbnail/capacitator-lab-basics-420.png',
//   url: '/virtual_lab/capacitor-lab-basics_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/CAPACITOR LAB BASICS.mp4'
// },
// {
//   id: 'faradays-electromagnetic-lab',
//   name: "Faraday's Electromagnetic Lab",
//   thumbnail: '/video/Simulators_Thumbnail/faradays-electromagnetic-lab-420.png',
//   url: '/virtual_lab/faradays-electromagnetic-lab_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/FARADAYS ELECTROMAGNETIC LAB.mp4'
// },
// {
//   id: 'generator',
//   name: 'Generator',
//   thumbnail: '/video/Simulators_Thumbnail/generator-420.png',
//   url: '/virtual_lab/generator_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/GENERATOR.mp4'
// },
// {
//   id: 'circuit-construction-kit-ac',
//   name: 'Circuit Construction Kit: AC',
//   thumbnail: '/video/Simulators_Thumbnail/circuit-construction-kit-ac-420.png',
//   url: '/virtual_lab/circuit-construction-kit-ac_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/CIRCUIT CONSTRUCTION KIT AC.mp4'
// },
// {
//   id: 'circuit-construction-kit-ac-dc',
//   name: 'Circuit Construction Kit: AC+DC',
//   thumbnail: '/video/Simulators_Thumbnail/circuit-construction-kit-ac-dc-420.png',
//   url: '/virtual_lab/circuit-construction-kit-ac-dc_en.html',
//   category: 'Physics',
//   subject: 'Electricity, Magnets & Circuits',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en', 'ur'],
//   videoUrl: '/video/Simulators/CIRCUIT CONSTRUCTION KIT AC DC.mp4'
// },
// {
//   id: 'photoelectric-effect',
//   name: 'Photoelectric Effect',
//   thumbnail: '/video/Simulators_Thumbnail/photoelectric-effect-420.png',
//   url: '/virtual_lab/photoelectric-effect_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/PHOTOELECTRIC EFFECT.mp4'
// },
// {
//   id: 'radioactive-dating-game',
//   name: 'Radioactive Dating Game',
//   thumbnail: '/video/Simulators_Thumbnail/radioactive-dating-game-420.png',
//   url: '/virtual_lab/radioactive-dating-game_en.html',
//   category: 'Physics',
//   subject: 'Nuclear Physics',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/RADIOACTIVE DATING GAME.mp4'
// },
// {
//   id: 'nuclear-fission',
//   name: 'Nuclear Fission',
//   thumbnail: '/video/Simulators_Thumbnail/nuclear-fission-420.png',
//   url: '/virtual_lab/nuclear-fission_en.html',
//   category: 'Physics',
//   subject: 'Nuclear Physics',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/NUCLEAR FISSION.mp4'
// },
// {
//   id: 'alpha-decay',
//   name: 'Alpha Decay',
//   thumbnail: '/video/Simulators_Thumbnail/alpha-decay-420.png',
//   url: '/virtual_lab/alpha-decay_en.html',
//   category: 'Physics',
//   subject: 'Nuclear Physics',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/ALPHA DECAY.mp4'
// },
// {
//   id: 'beta-decay',
//   name: 'Beta Decay',
//   thumbnail: '/video/Simulators_Thumbnail/beta-decay-420.png',
//   url: '/virtual_lab/beta-decay_en.html',
//   category: 'Physics',
//   subject: 'Nuclear Physics',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/BETA DECAY.mp4'
// },
// {
//   id: 'quantum-bound-states',
//   name: 'Quantum Bound States',
//   thumbnail: '/video/Simulators_Thumbnail/quantum-bound-states-420.png',
//   url: '/virtual_lab/quantum-bound-states_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/QUANTUM BOUND STATES.mp4'
// },
// {
//   id: 'quantum-wave-interference',
//   name: 'Quantum Wave Interference',
//   thumbnail: '/video/Simulators_Thumbnail/quantum-wave-interference-420.png',
//   url: '/virtual_lab/quantum-wave-interference_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/QUANTUM WAVE INTERFERENCE.mp4'
// },
// {
//   id: 'lasers',
//   name: 'Lasers',
//   thumbnail: '/video/Simulators_Thumbnail/lasers-420.png',
//   url: '/virtual_lab/lasers_en.html',
//   category: 'Physics',
//   subject: 'Light & Radiation',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/LASERS.mp4'
// },
// {
//   id: 'stern-gerlach-experiment',
//   name: 'Stern-Gerlach Experiment',
//   thumbnail: '/video/Simulators_Thumbnail/stern-gerlach-experiment-420.png',
//   url: '/virtual_lab/stern-gerlach-experiment_en.html',
//   category: 'Physics',
//   subject: 'Quantum Phenomena',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/STERN GERLACH EXPERIMENT.mp4'
// },
// {
//   id: 'optical-tweezers-and-applications',
//   name: 'Optical Tweezers and Applications',
//   thumbnail: '/video/Simulators_Thumbnail/optical-tweezers-and-applications-420.png',
//   url: '/virtual_lab/optical-tweezers-and-applications_en.html',
//   category: 'Physics',
//   subject: 'Light & Radiation',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/OPTICAL TWEEZERS AND APPLICATIONS.mp4'
// },
// {
//   id: 'torque',
//   name: 'Torque',
//   thumbnail: '/video/Simulators_Thumbnail/torque-420.png',
//   url: '/virtual_lab/torque_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/TORQUE.mp4'
// },
// {
//   id: 'reactions-and-rates',
//   name: 'Reactions & Rates',
//   thumbnail: '/video/Simulators_Thumbnail/reactions-and-rates-420.png',
//   url: '/virtual_lab/reactions-and-rates_en.html',
//   category: 'Chemistry',
//   subject: 'General Chemistry',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/REACTIONS AND RATES.mp4'
// },
// {
//   id: 'membrane-channels',
//   name: 'Membrane Channels',
//   thumbnail: '/video/Simulators_Thumbnail/membrane-channels-420.png',
//   url: '/virtual_lab/membrane-channels_en.html',
//   category: 'Biology',
//   subject: 'Biology',
//   classes: ['11', '12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/MEMBRANE CHANNELS.mp4'
// },
// {
//   id: 'natural-selection-advanced',
//   name: 'Natural Selection (Advanced)',
//   thumbnail: '/video/Simulators_Thumbnail/natural-selection-advanced-420.png',
//   url: '/virtual_lab/natural-selection-advanced_en.html',
//   category: 'Biology',
//   subject: 'Biology',
//   classes: ['12'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/NATURAL SELECTION ADVANCED.mp4'
// },
// {
//   id: 'plate-tectonics',
//   name: 'Plate Tectonics',
//   thumbnail: '/video/Simulators_Thumbnail/plate-tectonics-420.png',
//   url: '/virtual_lab/plate-tectonics_en.html',
//   category: 'Earth & Space',
//   subject: 'Earth Science',
//   classes: ['7', '8'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/PLATE TECTONICS.mp4'
// },
// {
//   id: 'seasons',
//   name: 'Seasons',
//   thumbnail: '/video/Simulators_Thumbnail/seasons-420.png',
//   url: '/virtual_lab/seasons_en.html',
//   category: 'Earth & Space',
//   subject: 'Earth Science',
//   classes: ['6', '7', '8'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/SEASONS.mp4'
// },
// {
//   id: 'the-ramp',
//   name: 'The Ramp',
//   thumbnail: '/video/Simulators_Thumbnail/the-ramp-420.png',
//   url: '/virtual_lab/the-ramp_en.html',
//   category: 'Physics',
//   subject: 'Motion',
//   classes: ['9', '10', '11'],
//   isNew: false,
//   availableLanguages: ['en'],
//   videoUrl: '/video/Simulators/THE RAMP.mp4'
// }


// 
  ];

  private configuredMediaUrl(url: string | undefined): string | undefined {
    return url?.replace('https://apifuturexcamp.theteachly.com/uploads', environment.urls.uploads);
  }

  private withConfiguredMediaUrls(simulator: Simulator): Simulator {
    const videoUrls = simulator.videoUrls
      ? Object.fromEntries(
          Object.entries(simulator.videoUrls).map(([key, url]) => [key, this.configuredMediaUrl(url)])
        ) as Simulator['videoUrls']
      : undefined;

    return {
      ...simulator,
      thumbnail: this.configuredMediaUrl(simulator.thumbnail) || simulator.thumbnail,
      videoUrl: this.configuredMediaUrl(simulator.videoUrl),
      ...(videoUrls ? { videoUrls } : {}),
    };
  }

  getSimulators(): Observable<Simulator[]> {
    return of(this.simulators.map((simulator) => this.withConfiguredMediaUrls(simulator)));
  }

  getSimulatorById(id: string): Observable<Simulator | undefined> {
    const simulator = this.simulators.find(s => s.id === id);
    return of(simulator ? this.withConfiguredMediaUrls(simulator) : undefined);
  }

  /**
   * Returns all simulators available for a given class (e.g. '1'...'12', 'University').
   */
  getSimulatorsByClass(className: string): Observable<Simulator[]> {
    return of(this.simulators
      .filter(s => s.classes.includes(className))
      .map((simulator) => this.withConfiguredMediaUrls(simulator))
    );
  }

  /**
   * Returns the distinct list of all classes across simulators, sorted numerically
   * (with 'University' pushed to the end).
   */
  getAllClasses(): Observable<string[]> {
    const classSet = new Set<string>();
    this.simulators.forEach(s => s.classes.forEach(c => classSet.add(c)));
    const classes = Array.from(classSet).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (isNaN(numA) && isNaN(numB)) return a.localeCompare(b);
      if (isNaN(numA)) return 1;
      if (isNaN(numB)) return -1;
      return numA - numB;
    });
    return of(classes);
  }
}
