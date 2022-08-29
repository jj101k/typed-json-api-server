import { Schema } from "./Schema"

/**
 *
 */
export interface SchemaFactory {
    /**
     *
     * @param type
     * @returns
     */
    getSchema(type: string): Schema<any, any, any, any>
}