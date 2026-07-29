import { Injectable } from '@angular/core';
import { ExampleRepository } from '../repositories/example.repository';

@Injectable({
  providedIn: 'root',
})
export class ExampleUseCase {
  constructor(private repository: ExampleRepository) {}
}
