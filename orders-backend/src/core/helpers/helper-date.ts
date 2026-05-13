
export class HelperDateFormatter {
    static formatLocalDate(date: Date): string {
        return new Date(date).toLocaleDateString('fr-FR');
    }

    static formatDateHorodatage(date: Date | string): string {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDay()).padStart(2, '0');

        return `${year}${month}${day}`;
    }
}