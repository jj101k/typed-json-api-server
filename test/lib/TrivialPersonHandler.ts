import { AttributeSchema } from "../../src/AttributeSchema"
import { EntityTypeHandler } from "../../src/EntityTypeHandler"
import { Schema } from "../../src/Schema"
import { SchemaFactory } from "../../src/SchemaFactory"

class Person {
    id: string
    name: string
    bestFriend: Person | null
}

class PersonSchema extends Schema<Person, "name", "bestFriend", never> {
    public attributeSchema: AttributeSchema<"name"> = {notNullable: {name: "string"}, nullable: {}}
    public relationshipSchema = {single: {bestFriend: ["person"]}}
    objectType(relationship: string): string {
        if(relationship == "bestFriend") {
            return "person"
        } else {
            throw new Error(`Unknown relationship: ${relationship}`)
        }
    }
}

class PersonSchemaFactory implements SchemaFactory {
    getSchema(type: string): Schema<any, any, any, any> {
        if(type == "person") {
            return new PersonSchema()
        } else {
            throw new Error(`Type ${type} not known`)
        }
    }
}

export class TrivialPersonHandler extends EntityTypeHandler<string, Person> {
    protected schema = new PersonSchema()
    protected schemaFactory = new PersonSchemaFactory()
    create(id: string, data: Partial<Person>): boolean {
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