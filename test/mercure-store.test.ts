import { describe, expect, it, jest } from '@jest/globals';
import MercureStore from '../src/mercure-store';

const defaultOptions = {
    hubUrl: 'https://localhost:9000/.well-known/mercure',
    topic: 'test',
    eventListener: () => {},
};

const createMessage = (data: any) => new MessageEvent('message', { data });

describe('MercureStore', () => {
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();
    const closeMock = jest.fn();

    global.EventSource = <typeof EventSource>(<unknown>jest.fn().mockImplementation(() => {
        return {
            addEventListener: addEventListenerMock,
            removeEventListener: removeEventListenerMock,
            close: closeMock,
        };
    }));

    it('should work with plain string', () => {
        const store = new MercureStore('initial string', {
            ...defaultOptions,
            append: false,
            json: false,
        });

        expect(store.get()).toStrictEqual('initial string');

        store.setValueFromMessage(createMessage('new string value'));

        expect(store.get()).toStrictEqual('new string value');
    });

    it('should work with plain object', () => {
        const store = new MercureStore(
            { value: 'initial json' },
            {
                ...defaultOptions,
                append: false,
                json: true,
            }
        );

        expect(store.get()).toStrictEqual({ value: 'initial json' });

        store.setValueFromMessage(createMessage(`{"value":"new json value"}`));

        expect(store.get()).toStrictEqual({ value: 'new json value' });
    });

    it('should work with string array', () => {
        const store = new MercureStore(['first string'], {
            ...defaultOptions,
            append: true,
            json: false,
        });

        expect(store.get()).toStrictEqual(['first string']);

        store.setValueFromMessage(createMessage('second string'));

        expect(store.get()).toStrictEqual(['first string', 'second string']);
    });

    it('should work with object array', () => {
        const store = new MercureStore([{ value: 'first json string' }], {
            ...defaultOptions,
            append: true,
            json: true,
        });

        expect(store.get()).toStrictEqual([{ value: 'first json string' }]);

        store.setValueFromMessage(createMessage(`{"value":"second json string"}`));

        expect(store.get()).toStrictEqual([{ value: 'first json string' }, { value: 'second json string' }]);
    });
});
