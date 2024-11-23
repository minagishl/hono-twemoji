# Hono Twemoji

This repository contains code that converts an emoji into a Twemoji and returns it as an image.

## Usage

All requests return an image stream to be used directly in an `<img/>` tag.

**Example of returning `thumbs up` for Twemoji:**

```
https://hono-twemoji.pages.dev/emoji/👍.png
```

**Get a list of Twemoji URLs:**

```
https://hono-twemoji.pages.dev/api/emoji/👍
```

**Get the URL of a specific format of Twemoji:**

```
https://hono-twemoji.pages.dev/api/emoji/👍?format=svg
```

Available formats are `png`, `svg`

## License

`hono-twemoji` project is licensed under the [MIT License](LICENSE).
