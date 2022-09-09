import { TrivialFakeHandler } from "./TrivialFakeHandler"
import { BookSchema } from "../TestSchema/BookSchema"

/**
 *
 */
export class TrivialBookHandler extends TrivialFakeHandler<string, typeof BookSchema> {
    protected schema = BookSchema
}
