import { ExampleModel } from '../../domain/models/example.model';

export abstract class ExampleRepository {
  abstract getExample(id: string): Promise<ExampleModel>;
}
