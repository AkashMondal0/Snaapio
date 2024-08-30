const timeFormat = (time: Date | string): string => {
    const format = new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    return format
}
const dateFormat = (date: string | any) => {

    if (!date) {
        return ''
    }

    return new Date(date).toLocaleDateString("en-US",
        { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', })
}

export {
    timeFormat,
    dateFormat
}