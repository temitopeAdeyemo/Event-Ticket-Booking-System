import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1738963018853 implements MigrationInterface {
    name = 'Migrations1738963018853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "WaitLists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid, "user_id" uuid, CONSTRAINT "UQ_bbaa05c330c480925dbc404f6eb" UNIQUE ("id"), CONSTRAINT "PK_bbaa05c330c480925dbc404f6eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100), "password" character varying(100), "full_name" character varying(50), CONSTRAINT "UQ_9862f679340fb2388436a5ab3e4" UNIQUE ("id"), CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Bookings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_id" uuid, "user_id" uuid, CONSTRAINT "UQ_383e0a5652b33012e15e1d0192a" UNIQUE ("id"), CONSTRAINT "PK_383e0a5652b33012e15e1d0192a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" character varying(50), "description" character varying(250), "totalTicket" integer, CONSTRAINT "UQ_efc6f7ffffa26a4d4fe5f383a0b" UNIQUE ("id"), CONSTRAINT "PK_efc6f7ffffa26a4d4fe5f383a0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "WaitLists" ADD CONSTRAINT "FK_ee93bea5f174cff759b1d2adbcc" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WaitLists" ADD CONSTRAINT "FK_b91d43bb2d1a3f4cc88a720190b" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Bookings" ADD CONSTRAINT "FK_2eb08f2b6abd0104a861e085c76" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Bookings" ADD CONSTRAINT "FK_166b5b6744f61047dc35935a057" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Bookings" DROP CONSTRAINT "FK_166b5b6744f61047dc35935a057"`);
        await queryRunner.query(`ALTER TABLE "Bookings" DROP CONSTRAINT "FK_2eb08f2b6abd0104a861e085c76"`);
        await queryRunner.query(`ALTER TABLE "WaitLists" DROP CONSTRAINT "FK_b91d43bb2d1a3f4cc88a720190b"`);
        await queryRunner.query(`ALTER TABLE "WaitLists" DROP CONSTRAINT "FK_ee93bea5f174cff759b1d2adbcc"`);
        await queryRunner.query(`DROP TABLE "Events"`);
        await queryRunner.query(`DROP TABLE "Bookings"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "WaitLists"`);
    }

}
