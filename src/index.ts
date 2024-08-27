import knex, { Knex } from 'knex';
import { IOptionQuery } from './option.interface';
import 'reflect-metadata';
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
    static columns: { name: string; type: string }[] | undefined;
    static select?: string[];
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
            return options?.limit
                ? ((await queryBuilder.limit(options.limit)) as Array<
                      Partial<T>
                  >)
                : ((await queryBuilder) as Array<Partial<T>>) || [];
        }
        if (subClass.select) {
            for (const item of subClass.select) {
                queryBuilder.select(item);
            }
            return options?.limit
                ? (await queryBuilder.limit(options.limit)) ||
                      ([] as Array<Partial<T>>)
                : (await queryBuilder) || ([] as Array<Partial<T>>);
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
        return options?.where
            ? await queryBuilder.where(options.where).first()
            : await queryBuilder.first();
    }
}

export { BaseModel, Entity, Column };
