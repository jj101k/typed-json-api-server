import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Book } from "./Book"

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Book, _ => _.author)
    books: Book[]
}
