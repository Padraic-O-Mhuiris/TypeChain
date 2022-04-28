import { GenerateDataModel } from './config'
import { createSchema, IModel } from './schema'

export async function generate<M extends IModel>(model: M, generate: GenerateDataModel<M>) {
  const data = await generate()

  const schemaResult = createSchema(model).safeParse(data)

  if (schemaResult.success) {
    // eslint-disable-next-line
    console.log('Schema parsed successfully')
    // eslint-disable-next-line
    console.log(schemaResult.data)
  } else {
    // eslint-disable-next-line
    console.log('Schema parse failed')
    // eslint-disable-next-line
    console.error(schemaResult.error.toString())
  }
}
