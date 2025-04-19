import { BaseModel } from '..';
import { IColumn } from './column.interface';
interface IRelation {
    column: string;
    targetColumn: string;
    columns: Array<IColumn>;
    targetClass: typeof BaseModel;
}
export interface IRelations {
    [key: string]: IRelation;
}
