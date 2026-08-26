import { Injectable } from '@angular/core';
import { ExampleRepository } from '../../application/repositories/example.repository';
import { ExampleModel } from '../../domain/models/example.model';

@Injectable({
  providedIn: 'root',
})
export class ExampleAdapter implements ExampleRepository {
  constructor() {}

  async getExample(id: string): Promise<ExampleModel> {
    throw new Error('Method not implemented.');
  }
}
