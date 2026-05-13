
export class HelperNumberFormatter {
    static round(value: number): number {
        return Math.round(value);
    }

    static roundMoney(money: number): number {
        return Math.round(money * 100) / 100;
    }

    static formatMoney(value: number, fraction: number= 2): string {
        return new Intl.NumberFormat('fr-BE', {
            minimumFractionDigits: fraction,
            maximumFractionDigits: fraction,
        }).format(value);
    }

    static formatInteger(value: number): string {
        return value.toString();
    }

    static formatWithLeadingZero(value: number, digits: number): string {
        return value.toString().padStart(digits, '0');
    }
}