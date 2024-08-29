import { IColumn } from './column.interface';
interface IRelation {
    column: string;
    targetColumn: string;
    columns: Array<IColumn>;
}
export interface IRelations {
    [key: string]: IRelation;
}
