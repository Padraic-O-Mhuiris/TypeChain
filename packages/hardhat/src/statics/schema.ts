import { keys } from 'lodash'
import { z } from 'zod'

import { createTaggedAddressSchema, TaggedAddressSchema } from './address'

type ZodTupleLiterals<T extends readonly [...any[]]> = T extends [infer Head, ...infer Tail]
  ? [z.ZodLiteral<Head>, ...ZodTupleLiterals<Tail>]
  : []

type ContractSchemaModel<C extends string> = {
  [k in string]: {
    contract: C
    schema: z.AnyZodObject
  }
}

export type IModel = ContractSchemaModel<string>

type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never

// Possibly dangerous
// https://stackoverflow.com/questions/55127004/how-to-transform-union-type-to-tuple-type
// https://github.com/microsoft/TypeScript/issues/13298
type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : []

type ObjectKeysToTuple<T> = T extends Record<string, any> ? UnionToTuple<keyof T> : never

type CategoriesSchema<Model extends IModel> = z.ZodTuple<ZodTupleLiterals<ObjectKeysToTuple<Model>>>

type AddressesSchema<Model extends IModel> = z.ZodObject<{
  [k in ObjectKeysToTuple<Model>[number]]: z.ZodArray<TaggedAddressSchema<k>>
}>

type ContractsSchema<Model extends IModel> = z.ZodObject<{
  [k in ObjectKeysToTuple<Model>[number]]: z.ZodLiteral<Model[k]['contract']>
}>

type MetadataSchema<Model extends IModel> = z.ZodObject<{
  [k in ObjectKeysToTuple<Model>[number]]: z.ZodRecord<TaggedAddressSchema<k>, Model[k]['schema']>
}>

export type Schema<Model extends IModel> = z.ZodObject<{
  categories: CategoriesSchema<Model>
  addresses: AddressesSchema<Model>
  contracts: ContractsSchema<Model>
  metadata: MetadataSchema<Model>
}>

export type InferredSchema<S extends Schema<IModel>> = z.infer<S>

export type DataModel<M extends IModel> = z.infer<Schema<M>>

export const createSchema = <Model extends IModel>(model: Model): Schema<Model> => {
  const modelKeys = keys(model) as unknown as ObjectKeysToTuple<Model>

  const categories: CategoriesSchema<Model> = z.tuple(
    modelKeys.map((k) => z.literal(k)) as ZodTupleLiterals<ObjectKeysToTuple<Model>>,
  )

  const addresses: AddressesSchema<Model> = z.object(
    modelKeys.reduce(
      (acc, arg) => ({
        ...acc,
        [arg]: createTaggedAddressSchema(arg).array(),
      }),
      {} as {
        [k in ObjectKeysToTuple<Model>[number]]: z.ZodArray<TaggedAddressSchema<k>>
      },
    ),
  )

  const contracts: ContractsSchema<Model> = z.object(
    modelKeys.reduce(
      (acc, arg) => ({
        ...acc,
        [arg]: z.literal(model[arg].contract),
      }),
      {} as {
        [k in ObjectKeysToTuple<Model>[number]]: z.ZodLiteral<Model[k]['contract']>
      },
    ),
  )

  const metadata: MetadataSchema<Model> = z.object(
    modelKeys.reduce(
      (acc, arg) => ({
        ...acc,
        [arg]: z.record(createTaggedAddressSchema(arg), model[arg].schema),
      }),
      {} as {
        [k in ObjectKeysToTuple<Model>[number]]: z.ZodRecord<TaggedAddressSchema<k>, Model[k]['schema']>
      },
    ),
  )

  return z.object({
    categories,
    addresses,
    contracts,
    metadata,
  })
}
