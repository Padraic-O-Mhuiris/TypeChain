import { IModel, InferredSchema, Schema } from './schema'

export async function generate<S extends Schema<IModel>>(schema: S, generate: () => Promise<InferredSchema<S>>) {
  const fetchResult = await generate()
  const schemaResult = schema.safeParse(fetchResult)
  if (schemaResult.success) {
    // eslint-disable-next-line
    console.log('Schema parsed successfully')
    // eslint-disable-next-line
    console.log(schemaResult.data)
  } else {
    // eslint-disable-next-line
    console.log('Schema parse failed')
  }
}
