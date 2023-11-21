export interface IPackEncoder<T> {
    encode(pack: T, targetPath: string): void;
}