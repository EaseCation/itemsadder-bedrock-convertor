export interface IPackParser<T> {
    parse(path: string): T;
}