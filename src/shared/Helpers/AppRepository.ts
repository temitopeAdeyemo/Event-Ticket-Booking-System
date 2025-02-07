import { Repository, DeepPartial, EntityTarget, ObjectLiteral, FindOptionsWhere, QueryRunner } from 'typeorm';
import { AppDataSource } from '../../config/Database.config';

export class AppRepository<T extends ObjectLiteral> {
  protected ormRepository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.ormRepository = AppDataSource.getRepository(entity);
  }

  async create(data: DeepPartial<T>, save = true): Promise<T> {
    const entity = this.ormRepository.create(data);

    if (save) return this.ormRepository.save(entity);
    return entity;
  }

  async update(filter: string | number | FindOptionsWhere<T> | string[], updateData: Partial<Partial<T>>) {
    return await this.ormRepository.update(filter, updateData);
  }

  async delete(criteria: string | string[] | FindOptionsWhere<T>) {
    await this.ormRepository.delete(criteria);
  }

  async findOneByData(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
    return this.ormRepository.findOne({ where: filter });
  }

  async findOneByDataAndLock(queryRunner: QueryRunner, filter: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null> {
    return await queryRunner.manager.findOne(this.ormRepository.target, { where: filter, lock: { mode: 'pessimistic_write' } });
  }

  async findOneById(id: T['id']): Promise<T | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async save(document: T): Promise<T> {
    return await this.ormRepository.save(document);
  }

  async findAll(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
    return this.ormRepository.find({ where: filter });
  }

  async count(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
    return this.ormRepository.count({ where: filter });
  }
}
