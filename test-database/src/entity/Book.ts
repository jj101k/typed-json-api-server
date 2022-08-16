import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Author } from "./Author"

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @ManyToOne(() => Author, _ => _.books)
    author: Author
}
