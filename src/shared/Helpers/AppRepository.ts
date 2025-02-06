import { Repository, DeepPartial, EntityTarget, ObjectLiteral, FindOptionsWhere, QueryRunner } from 'typeorm';
import AppDataSource from '../../config/Database.config';

export class AppRepository<T extends ObjectLiteral> {
  protected ormRepository: Repository<T>;

  constructor(entity: EntityTarget<T>) {
    this.ormRepository = AppDataSource.getRepository(entity);
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.ormRepository.create(data);
    return this.ormRepository.save(entity);
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

  async findOneById(id: T['id']): Promise<T | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async save(document: T): Promise<T> {
    return await this.ormRepository.save(document);
  }

  async findAll(filter: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]> {
    return this.ormRepository.find({ where: filter });
  }

  public async startTransaction(): Promise<QueryRunner> {
    const queryRunner = AppDataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      return queryRunner;
    } catch (error) {
      await queryRunner.release();
      throw error;
    }
  }
}
