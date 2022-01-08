export class TextFormat {
    static truncate(text: string, chars?: number): string {
        chars = chars ? chars : 10;
        return `${text.substr(0, chars)} ...`;
    }

    static displayFlyer(flyer: any) {
        return `${flyer.fileBaseUrl}/${flyer.filename}`;
    }

    static displayPriceRange(pricings: []) {
        if (pricings.length == 0) {
            return 'N/A';
        } else {
            let amounts: number[] = [];
            pricings.map((pr: any) => {
                amounts.push(pr.pricing.amount);
            });
            const min = Math.min(...amounts);
            const max = Math.max(...amounts);
            return min != max ? `GHS ${min} - GHS ${max}` : `GHS ${min}`;
        }
    }
}
