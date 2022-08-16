import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1660668233798 implements MigrationInterface {
    name = 'Initial1660668233798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "authorId" integer)`);
        await queryRunner.query(`CREATE TABLE "author" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "age" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "authorId" integer, CONSTRAINT "FK_66a4f0f47943a0d99c16ecf90b2" FOREIGN KEY ("authorId") REFERENCES "author" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_book"("id", "name", "authorId") SELECT "id", "name", "authorId" FROM "book"`);
        await queryRunner.query(`DROP TABLE "book"`);
        await queryRunner.query(`ALTER TABLE "temporary_book" RENAME TO "book"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" RENAME TO "temporary_book"`);
        await queryRunner.query(`CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "authorId" integer)`);
        await queryRunner.query(`INSERT INTO "book"("id", "name", "authorId") SELECT "id", "name", "authorId" FROM "temporary_book"`);
        await queryRunner.query(`DROP TABLE "temporary_book"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "author"`);
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
