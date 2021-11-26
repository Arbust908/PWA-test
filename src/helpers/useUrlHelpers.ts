export function addVisibleFilter(url: string): string {
    const hasQuery = url.indexOf('?') > -1;

    if (hasQuery) {
        return `${url}&visible=true`;
    } else {
        return `${url}?visible=true`;
    }
}
