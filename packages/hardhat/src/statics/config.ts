import { DataModel, IModel } from './schema'

export type GenerateDataModel<Model extends IModel> = () => Promise<DataModel<Model>>

export interface GenericStaticsConfig<Model extends IModel> {
  generate: GenerateDataModel<Model>
  model: Model
}

export type StaticsConfig = GenericStaticsConfig<IModel>

export const createStaticsConfig = <M extends IModel>(
  model: M,
  generate: () => Promise<DataModel<M>>,
): GenericStaticsConfig<M> => ({
  model,
  generate,
})
