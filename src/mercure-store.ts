/**
 * @author Thomas Choquet <thomas.choquet.pro@gmail.com>
 */
import { writable, get } from 'svelte/store';
import type { Writable, Updater } from 'svelte/store';

export type MercureStoreOptions = {
    hubUrl: string;
    topic: string;
    append?: boolean;
    json?: boolean;
    eventSourceOptions?: EventSourceInit;
};

export const defaultOptions = {
    append: false,
    json: true,
};

export default class MercureStore<T> {
    public options: MercureStoreOptions;
    public eventSource?: EventSource;
    public value: Writable<T>;
    public update: (this: void, updater: Updater<T>) => void;
    public subscribe: (this: void, updater: Updater<T>) => void;
    public set: (this: void, value: T) => void;

    constructor(defaultValue: T, options: MercureStoreOptions) {
        this.value = writable(defaultValue);
        this.update = this.value.update;
        this.subscribe = this.value.subscribe;
        this.set = this.value.set;
        this.options = { ...defaultOptions, ...options };
        this.createListener();
    }

    createListener() {
        const u = new URL(this.options.hubUrl);
        u.searchParams.append('topic', this.options.topic);
        this.eventSource = new EventSource(u.toString(), this.options.eventSourceOptions);
        this.eventSource.addEventListener('message', this.setValueFromMessage.bind(this));
    }

    setValueFromMessage(event: MessageEvent<any>) {
        let data = event.data;
        if (this.options.json) {
            data = JSON.parse(event.data);
        }
        if (this.options.append) {
            this.set(<T>[...(<any[]>this.get()), data]);
        } else {
            this.set(data);
        }
    }

    close() {
        if (this.eventSource) {
            this.eventSource.close();
        }
    }

    get(): T {
        return get(this.value);
    }

    refresh() {
        this.set(this.get());
    }
}
