export interface Route {
    key: string,
    name: string,
    params: {
        chatId: number
    },
    path: undefined
}

export interface Navigation {
    addListener: (type: string, callback: () => void) => void,
    canGoBack: () => boolean,
    dangerouslyGetParent: () => any,
    dangerouslyGetState: () => any,
    dispatch: (action: any) => void,
    goBack: () => void,
    isFocused: () => boolean,
    navigate: (name: string, params: any) => void,
    pop: () => void,
    popToTop: () => void,
    push: (name: string, params: any) => void,
    removeListener: (type: string, callback: () => void) => void,
    replace: (name: string, params: any) => void,
    reset: (state: any) => void,
    setOptions: (options: any) => void,
    setParams: (params: any) => void,
    toggleDrawer: () => void,
}

