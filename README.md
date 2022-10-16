# Svelte Store Mercure

A simple yet useful Svelte store that allows you to keep a variable in sync with data coming from
a [Mercure](https://mercure.rocks/docs/getting-started) EventSource stream

## Configuration

| Parameter            | Type      | Default value | Description                                                                                                                                         |
|:---------------------|:----------|:--------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| `hubUrl`             | `string`  | /             | **Required** Your Mercure HUB url                                                                                                                   |
| `topic`              | `string`  | /             | **Required** The topic you want to subscribe to                                                                                                     |
| `append`             | `boolean` | `false`       | If `true`, new messages will be appended to the initial array                                                                                       |
| `json`               | `boolean` | `true`        | Set this to `false` if the received event.data is a not a json encoded string                                                                       |
| `eventSourceOptions` | `object`  | /             | Object containing options passed to the [EventSource constructor](https://developer.mozilla.org/en-US/docs/Web/API/EventSource/EventSource#options) |

## Usage/Examples

#### Basic usage :

```html

<script>
    import MercureStore from "svelte-store-mercure";

    // The initial value will be replaced every time a new message is received in the subscribed topic
    let message = new MercureStore({ value: "Initial value" }, {
        hubUrl: 'https://mercure.localhost/.well-known/mercure',
        topic: 'chat'
    });
</script>

<div>
    Last message : {$message.value}
</div>
```

#### Usage with Array :

```html

<script>
    import MercureStore from "svelte-store-mercure";

    // New values will be appended to the provided array
    let allMessages = new MercureStore([{ value: "Hey!" }, { value: "How are you?" }], {
        hubUrl: 'https://mercure.localhost/.well-known/mercure',
        topic: 'chat',
        append: true
    });
</script>

<div>Messsages :</div>
<ul>
    {#each $allMessages as message}
        <li>{message.value}</li>
    {/each}
</ul>
```

#### It works with plain string to :

```html

<script>
    import MercureStore from 'svelte-store-mercure';

    let allMessages = new MercureStore(['Hey!', 'How are you?'], {
        hubUrl: 'https://mercure.localhost/.well-known/mercure',
        topic: 'chat',
        append: true,
        json: false,
    });
</script>

<div>Messsages :</div>
<ul>
    {#each $allMessages as message}
        <li>{message}</li>
    {/each}
</ul>
```

