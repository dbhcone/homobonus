export class TextFormat {
    static truncate(text: string, chars?: number):string {
        chars = chars ? chars : 10;
        return `${text.substr(0, chars)} ...`;
    }
}