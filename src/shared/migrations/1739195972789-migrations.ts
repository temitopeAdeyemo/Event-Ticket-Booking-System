import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1739195972789 implements MigrationInterface {
    name = 'Migrations1739195972789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "WaitLists" ADD CONSTRAINT "UQ_bbaa05c330c480925dbc404f6eb" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "WaitLists" DROP CONSTRAINT "FK_ee93bea5f174cff759b1d2adbcc"`);
        await queryRunner.query(`ALTER TABLE "Bookings" DROP CONSTRAINT "FK_2eb08f2b6abd0104a861e085c76"`);
        await queryRunner.query(`ALTER TABLE "Events" ADD CONSTRAINT "UQ_efc6f7ffffa26a4d4fe5f383a0b" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "Bookings" ADD CONSTRAINT "UQ_383e0a5652b33012e15e1d0192a" UNIQUE ("id")`);
        await queryRunner.query(`ALTER TABLE "WaitLists" DROP CONSTRAINT "FK_b91d43bb2d1a3f4cc88a720190b"`);
        await queryRunner.query(`ALTER TABLE "Bookings" DROP CONSTRAINT "FK_166b5b6744f61047dc35935a057"`);
        await queryRunner.query(`ALTER TABLE "User" ADD CONSTRAINT "UQ_9862f679340fb2388436a5ab3e4" UNIQUE ("id")`);
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
        await queryRunner.query(`ALTER TABLE "User" DROP CONSTRAINT "UQ_9862f679340fb2388436a5ab3e4"`);
        await queryRunner.query(`ALTER TABLE "Bookings" ADD CONSTRAINT "FK_166b5b6744f61047dc35935a057" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WaitLists" ADD CONSTRAINT "FK_b91d43bb2d1a3f4cc88a720190b" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Bookings" DROP CONSTRAINT "UQ_383e0a5652b33012e15e1d0192a"`);
        await queryRunner.query(`ALTER TABLE "Events" DROP CONSTRAINT "UQ_efc6f7ffffa26a4d4fe5f383a0b"`);
        await queryRunner.query(`ALTER TABLE "Bookings" ADD CONSTRAINT "FK_2eb08f2b6abd0104a861e085c76" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WaitLists" ADD CONSTRAINT "FK_ee93bea5f174cff759b1d2adbcc" FOREIGN KEY ("event_id") REFERENCES "Events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "WaitLists" DROP CONSTRAINT "UQ_bbaa05c330c480925dbc404f6eb"`);
    }

}
