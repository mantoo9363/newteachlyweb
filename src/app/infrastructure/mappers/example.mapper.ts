import { ExampleModel } from '../../domain/models/example.model';

export class ExampleMapper {
  static toDomain(raw: any): ExampleModel {
    return {
      id: raw.id,
      name: raw.name,
    };
  }

  static toPersistence(domain: ExampleModel): any {
    return {
      id: domain.id,
      name: domain.name,
    };
  }
}
