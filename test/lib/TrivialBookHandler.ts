import { AttributeSchema } from "../../src/AttributeSchema"
import { EntityTypeHandler } from "../../src/EntityTypeHandler"
import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"

class Author {
    id: string
    name: string
}

class Book {
    id: string
    name: string
    author: Author
    forewordAuthor: Author | null
}

class BookSchema extends Schema<Book, "name", "author" | "forewordAuthor", never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {singleRequired: {author: ["author"]}, single: {forewordAuthor: ["author"]}}
    objectType(relationship: string): string {
        if(relationship == "author") {
            return "author"
        } else {
            throw new Error(`Unknown relationship: ${relationship}`)
        }
    }
}

class AuthorSchema extends Schema<Author, "name", never, never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {many: {books: ["book"]}}
    objectType(relationship: string): string {
        throw new Error(`Unknown relationship: ${relationship}`)
    }
}

class BookSchemaFactory implements SchemaFactory {
    getSchema(type: string): Schema<any, any, any, any> {
        if(type == "book") {
            return new BookSchema()
        } else if(type == "author") {
            return new AuthorSchema()
        } else {
            throw new Error(`Type ${type} not known`)
        }
    }
}

export class TrivialBookHandler extends EntityTypeHandler<string, Book> {
    protected schema = new BookSchema()
    protected schemaFactory = new BookSchemaFactory()
    create(id: string, data: Partial<Book>): boolean {
        return false
    }
    delete(...ids: string[]) {
        return false
    }
    getMany(filter: any, objectsSeen: number, sort?: any, page?: any, include?: string[] | undefined): { data: Partial<{ id: string }>[]; included?: any[] | undefined; nextPage?: any } {
        return {
            data: [],
        }
    }
    getOne(id: string, include?: string[] | undefined): { data: Partial<{ id: string }>; included?: any[] | undefined } | null {
        return null
    }
    localRelations: Partial<Record<"id", { field: string; type: string }[]>> = {}
    update(id: string, data: Partial<{ id: string }>): boolean {
        return false
    }
    userHasAccess(type: "read" | "write", id: string) {
        return true
    }
}