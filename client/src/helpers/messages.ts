import { message } from 'antd'

export function useMessages() {
    const [messageApi, contextHolder] = message.useMessage()

    const successMessage = (content?: string) => {
        messageApi.open({
            type: 'success',
            content: content || 'Done'
        })
    }
    const errorMessage = (content?: string) => {
        messageApi.open({
            type: 'error',
            content: content || 'Error'
        })
    }
    const warningMessage = (content?: string) => {
        messageApi.open({
            type: 'warning',
            content: content || 'This is a warning message'
        })
    }

    return {
        successMessage,
        errorMessage,
        warningMessage,
        contextHolder
    }
}
