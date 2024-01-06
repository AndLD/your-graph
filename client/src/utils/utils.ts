import dayjs from 'dayjs'
import { INode } from './interfaces/nodes'

export const Utils = {
    randomInteger(min: number, max: number) {
        // получить случайное число от (min-0.5) до (max+0.5)
        const rand = min - 0.5 + Math.random() * (max - min + 1)
        return Math.round(rand)
    },
    getNodeLabel(node: INode) {
        if (!node.payload) {
            return null
        }

        return (
            node.payload?.title +
            (node.payload?.startDate
                ? '\n' +
                  dayjs(node.payload.startDate, 'DD.MM.YYYY')
                      .format('DD.MM.YYYY')
                      .toString() +
                  (node.payload.endDate
                      ? ' - ' +
                        dayjs(node.payload.endDate, 'DD.MM.YYYY')
                            .format('DD.MM.YYYY')
                            .toString()
                      : '')
                : '')
        )
    },
    renameIdKeyForItems(items: any[]) {
        return items.map(({ _id, ...rest }) => ({
            id: _id,
            ...rest,
        }))
    },
}
