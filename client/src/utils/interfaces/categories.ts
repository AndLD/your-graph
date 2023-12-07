import { CheckboxValueType } from 'antd/es/checkbox/Group'
import { ID } from '../types'

export interface ICategory {
    id: ID
    title: string
    clusterId: ID | null
    options: CheckboxValueType[]
    fields: { label: string; type: string }[]
}

export interface ICategoryPostBody {
    title: string
    clusterId: ID | null
    options: CheckboxValueType[]
    fields: { label: string; type: string }[]
}

export interface ICategoryBackend {
    _id: ID
    title: string
    clusterId: ID | null
    options: CheckboxValueType[]
    fields: { label: string; type: string }[]
}
