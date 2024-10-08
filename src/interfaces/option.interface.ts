export interface IOptionQuery<T> {
    limit?: number;
    where?: Partial<T>;
    relations?: Array<string>;
}
