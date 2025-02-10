import {
  Repository,
  DeepPartial,
  EntityTarget,
  ObjectLiteral,
  FindOptionsWhere,
  QueryRunner,
  FindOptionsOrder,
  FindOptionsRelations,
} from 'typeorm';
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

  async delete(criteria: string | string[] | FindOptionsWhere<T>, queryRunner?: QueryRunner) {
    if (queryRunner) {
      return await queryRunner.manager.softDelete(this.ormRepository.target, criteria);
    }
    await this.ormRepository.softDelete(criteria);
  }

  async findOneByData(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[], relations?: FindOptionsRelations<T>): Promise<T | null> {
    return this.ormRepository.findOne({ where: filter, relations });
  }

  async findOneByDataAndLock(
    queryRunner: QueryRunner,
    filter: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    order?: FindOptionsOrder<T> | undefined,
    relations?: FindOptionsRelations<T>,
    tables?: string[] | undefined
  ): Promise<T | null> {
    return await queryRunner.manager.findOne(this.ormRepository.target, {
      where: filter,
      lock: { mode: 'pessimistic_write', tables },
      order,
      relations,
    });
  }

  async findOneById(id: T['id']): Promise<T | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async save(document: T): Promise<T> {
    return await this.ormRepository.save(document);
  }

  async findAll(filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
    return this.ormRepository.find({ where: filter });
  }

  async count(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[], queryRunner?: QueryRunner) {
    if (queryRunner) {
      return await queryRunner.manager.count(this.ormRepository.target, { where: filter });
    }
    return await this.ormRepository.count({ where: filter });
  }
}
