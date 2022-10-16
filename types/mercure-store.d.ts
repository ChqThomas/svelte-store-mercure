import type { Writable, Updater } from 'svelte/store';
export declare type MercureStoreOptions = {
    hubUrl: string;
    topic: string;
    append?: boolean;
    json?: boolean;
    eventSourceOptions?: EventSourceInit;
};
export declare const defaultOptions: {
    append: boolean;
    json: boolean;
};
export default class MercureStore<T> {
    options: MercureStoreOptions;
    eventSource?: EventSource;
    value: Writable<T>;
    update: (this: void, updater: Updater<T>) => void;
    subscribe: (this: void, updater: Updater<T>) => void;
    set: (this: void, value: T) => void;
    constructor(defaultValue: T, options: MercureStoreOptions);
    createListener(): void;
    setValueFromMessage(event: MessageEvent<any>): void;
    close(): void;
    get(): T;
    refresh(): void;
}
