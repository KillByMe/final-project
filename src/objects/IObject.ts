export interface IObject {
    kill: boolean;
    update(timeDelta: number): void;
    x: number;
    y: number;
    width: number;
    height: number;
}
