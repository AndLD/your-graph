import dayjs from 'dayjs'
import { INode } from './interfaces/nodes'

export const Utils = {
    randomInteger(min: number, max: number) {
        // получить случайное число от (min-0.5) до (max+0.5)
        const rand = min - 0.5 + Math.random() * (max - min + 1)
        return Math.round(rand)
    },
    getNodeLabel(node: INode) {
        return (
            node.title +
            (node.startDate
                ? '\n' +
                  dayjs(node.startDate, 'DD.MM.YYYY')
                      .format('DD.MM.YYYY')
                      .toString() +
                  (node.endDate
                      ? ' - ' +
                        dayjs(node.endDate, 'DD.MM.YYYY')
                            .format('DD.MM.YYYY')
                            .toString()
                      : '')
                : '')
        )
    },
}
