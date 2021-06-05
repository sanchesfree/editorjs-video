![](https://badgen.net/badge/Editor.js/v2.0/blue)

# VideoFromList

Provides VideoFromList Blocks for the [Editor.js](https://editorjs.io).

Works only with pasted image URLs and requires no server-side uploader.

## Installation

### Install via NPM

Include module at your application

```javascript
const VideoFromList = require('@editorjs/videoFromList');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...
  
  tools: {
    ...
    videoFromList: VideoFromList,
  }
  
  ...
});
```

## Config Params

This Tool has no config params

## Output data

| Field          | Type      | Description                     |
| -------------- | --------- | ------------------------------- |
| url            | `string`  | image's url                     |
| caption        | `string`  | image's caption                 |
| id     | `string` | id from list             |


```json
{
    "type" : "image",
    "data" : {
        "url" : "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        "caption" : "Roadster // tesla.com",
        "id" : "140"
    }
}
```
