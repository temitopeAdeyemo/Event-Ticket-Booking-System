import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1739184058799 implements MigrationInterface {
    name = 'Migrations1739184058799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Events" ADD "event_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Events" DROP COLUMN "event_date"`);
    }

}
