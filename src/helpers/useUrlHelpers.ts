export function addVisibleFilter(url: string): string {
    const hasQuery = url.indexOf('?') > -1;

    if (hasQuery) {
        return `${url}&visible=1`;
    } else {
        return `${url}?visible=1`;
    }
}
