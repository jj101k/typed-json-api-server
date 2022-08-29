/**
 *
 */
export enum FetchedRelationFormat {
    // 0. number (TypeORM)
    RawId,
    // 1. {id: string} (TypeORM)
    IdOnly,
    // 2. {id: string, type: string} (Custom code)
    IdType,
    // 3. {...full object...} (TypeORM)
    FullWithType,
    // 4. {...full object..., type: string} (TypeORM)
    FullNoType
}
