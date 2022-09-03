import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"
import { BookSchema, AuthorSchema } from "./Book"
import { PersonSchema } from "./TrivialPersonHandler"


export class TestSchemaFactory implements SchemaFactory {
    getSchema(type: string): Schema<any, any, any, any> {
        if (type == "book") {
            return new BookSchema()
        } else if (type == "author") {
            return new AuthorSchema()
        } else if(type == "person") {
            return new PersonSchema()
         } else {
            throw new Error(`Type ${type} not known`)
        }
    }
}
