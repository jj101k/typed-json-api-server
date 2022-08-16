import "reflect-metadata"
import { DataSource } from "typeorm"
import { Author } from "./entity/Author"
import { Book } from "./entity/Book"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "test.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Author, Book],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
})
