import knex, { Knex } from 'knex';
import { IOptionQuery } from './interfaces/option.interface';
import 'reflect-metadata';
import { IColumn } from './interfaces/column.interface';
import { IRelations } from './interfaces/index.interface';
function Column() {
    return function (target: object, propertyKey: string | symbol): void {
        const constructor = target.constructor as typeof BaseModel & {
            columns?: { name: string; type: string }[];
        };

        // Initialize columns array if it doesn't exist
        if (!constructor.columns) {
            constructor.columns = [];
        }

        // Get the property type as a string
        const propertyType = Reflect.getMetadata(
            'design:type',
            target,
            propertyKey
        );

        // Add column metadata
        constructor.columns.push({
            name: propertyKey as string,
            type: propertyType.name, // Store the type name
        });
    };
}
function Relations(targetClass: object, column: string, targetColumn: string) {
    return function (target: object, propertyKey: string): void {
        const constructor = targetClass as typeof BaseModel & {
            columns?: { name: string; type: string }[];
        };
        const insideCalledDecoratorConstructor =
            target.constructor as typeof BaseModel;
        console.log(
            'constructor',
            constructor,
            targetClass,
            target.constructor
        );
        // Initialize columns array if it doesn't exist

        // Get the property type as a string
        const columns = constructor.columns;
        console.log(111111, propertyKey, columns);
        if (constructor.relations === undefined) {
            insideCalledDecoratorConstructor.relations = {};
        }

        insideCalledDecoratorConstructor.relations[propertyKey] = {
            columns: columns,
            column: column,
            targetColumn: targetColumn,
        };
        console.log('$$$$', constructor);
    };
}

function Entity(name?: string) {
    return function (target: Function): void {
        // Check if name is provided
        if (name) {
            // Use the provided name as the table name
            (target as typeof BaseModel).table = name;
        } else {
            //default class lowercase
            (target as typeof BaseModel).table = target.name.toLowerCase();
        }
    };
}

class BaseModel {
    static config: Knex.Config;
    static columns: Array<IColumn> | undefined;
    static select?: string[];
    static relations?: IRelations;
    static table: string;
    static checkConfig(): void {
        if (!this.config) {
            throw new Error('messyorm need config (it is same as knex config)');
        }
    }
    static async getAll<T extends BaseModel>(
        this: new () => T,
        options: IOptionQuery<T>
    ): Promise<Array<Partial<T>>> {
        const subClass = this as unknown as typeof BaseModel;
        subClass.checkConfig();
        const query = knex(subClass.config);
        const queryBuilder = query(subClass.table);
        if (options.where) {
            queryBuilder.where(options.where);
        }
        if (!subClass.columns) {
            if (options.limit) {
                return (
                    (await queryBuilder.select('*').limit(options.limit)) ||
                    ([] as Array<Partial<T>>)
                );
            } else {
                return (
                    (await queryBuilder.select('*')) ||
                    ([] as Array<Partial<T>> | undefined)
                );
            }
        }
        if (!subClass.select) {
            for (const item of subClass.columns) {
                queryBuilder.select(item.name);
            }
            if (options?.limit) {
                queryBuilder.limit(options.limit);
            }

            const data = (await queryBuilder) as Array<Partial<T>>;
            if (options.relations && data.length) {
                for (const el of data) {
                    for (const relElement of options.relations) {
                        const query = knex(subClass.config);
                        const queryBuilder = query(relElement);
                        const selectArr = subClass?.relations[relElement]
                            ? subClass?.relations[relElement].columns.map(
                                  (item) => item.name
                              )
                            : [];
                        el[relElement as keyof T] = (await queryBuilder
                            .select(selectArr)
                            .where(
                                subClass.relations[relElement].targetColumn,
                                el[
                                    subClass.relations[relElement]
                                        .column as keyof T
                                ]
                            )) as T[keyof T];
                    }
                    // console.log(
                    //     'el',
                    //     el,
                    //     options.relations,
                    //     subClass.relations
                    // );
                }
                return data;
            }
            return data;
        }
        if (subClass.select) {
            for (const item of subClass.select) {
                queryBuilder.select(item);
            }
            if (options.limit) {
                queryBuilder.limit(options.limit);
            }
            const data = await queryBuilder;
            if (options.relations && data.length) {
                for (const el of data) {
                    for (const relElement of options.relations) {
                        const query = knex(subClass.config);
                        const queryBuilder = query(relElement);
                        const selectArr = subClass?.relations[relElement]
                            ? subClass?.relations[relElement].columns.map(
                                  (item) => item.name
                              )
                            : [];
                        el[relElement as keyof T] = (await queryBuilder
                            .select(selectArr)
                            .where(
                                subClass.relations[relElement].targetColumn,
                                el[
                                    subClass.relations[relElement]
                                        .column as keyof T
                                ]
                            )) as T[keyof T];
                    }
                    // console.log(
                    //     'el',
                    //     el,
                    //     options.relations,
                    //     subClass.relations
                    // );
                }
                return data;
            }
            return data;
        }
        return [];
    }
    static async getOne<T extends BaseModel>(
        this: new () => T,
        options: IOptionQuery<T>
    ): Promise<Partial<T>> {
        const subClass = this as unknown as typeof BaseModel;
        subClass.checkConfig();
        const query = knex(subClass.config);
        const queryBuilder = query(subClass.table);
        if (options?.where) {
            queryBuilder.where(options.where);
        }
        const data = await queryBuilder.first();
        if (options.relations && data) {
            for (const relElement of options.relations) {
                const query = knex(subClass.config);
                const queryBuilder = query(relElement);
                const selectArr = subClass?.relations[relElement]
                    ? subClass?.relations[relElement].columns.map(
                          (item) => item.name
                      )
                    : [];
                data[relElement as keyof T] = (await queryBuilder
                    .select(selectArr)
                    .where(
                        subClass.relations[relElement].targetColumn,
                        data[subClass.relations[relElement].column as keyof T]
                    )) as T[keyof T];
            }
            // console.log(
            //     'el',
            //     el,
            //     options.relations,
            //     subClass.relations
            // );

            return data;
        }
        return data;
    }
}

export { BaseModel, Entity, Column, Relations };
