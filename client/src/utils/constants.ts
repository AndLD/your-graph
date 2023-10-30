export const VERSION = 'v1.0'
export const API_URL =
    /*process.env.REACT_APP_API_URL ||*/ 'http://localhost:8080'
export const LINE_SPLITTER = '::'

export const isMacOS = /Mac/.test(navigator.platform)

export const KEYBOARD = {
    CTRL_KEY: isMacOS ? 'metaKey' : 'ctrlKey',
}
