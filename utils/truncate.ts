const truncate = (str: string, length: number): string => {
    return str.length > length ? str.substring(0, length - 3) + '...' : str
}

export {
    truncate
}