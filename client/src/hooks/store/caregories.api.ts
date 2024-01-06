import { SetStateAction, useContext, useEffect } from 'react'
import { clusterContext } from '../../context'
import {
    useFetchCategoriesQuery,
    usePostCategoryMutation,
} from '../../store/categories.api'
import { ICategory, ICategoryPostBody } from '../../utils/interfaces/categories'
import { useToken } from '../auth'

export function usePostCategory(callback?: (newSourceId: string) => void) {
    const clusterId = useContext(clusterContext).clusterId
    const [categories, setCategories] =
        useContext(clusterContext).categoriesState

    const [postCategoryMutation] = usePostCategoryMutation()

    return (body: ICategoryPostBody) => {
        if (!clusterId) {
            return
        }
        postCategoryMutation({
            clusterId,
            body,
        }).then((response: any) => {
            const category = response.data
            setCategories([...categories, category])
            if (callback) callback(category.id)
        })
    }
}

export function useFetchCategories(
    setCategories: React.Dispatch<SetStateAction<ICategory[]>>
) {
    const clusterId = useContext(clusterContext).clusterId
    const token = useToken()

    const fetchCategoriesQuery = useFetchCategoriesQuery(
        { clusterId: clusterId || '' },
        {
            skip: !token || !clusterId,
        }
    )

    useEffect(() => {
        if (fetchCategoriesQuery.data) {
            setCategories(fetchCategoriesQuery.data)
        }
    }, [fetchCategoriesQuery.data])
}
