export function formatDate(date: string) {
    const newDate = new Date(date);

     return new Intl.DateTimeFormat(navigator.language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(newDate);
}
