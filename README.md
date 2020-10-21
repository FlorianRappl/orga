# Personal Organization

A couple of projects that make my everyday life easier.

## Projects

For all projects you need to have Node.js installed. Each project is located in its own subfolder and needs to have its dependencies installed via `npm i`.

All projects can be configured via the command line or a file `.orgarc`. This file can also be shared in the root directory.

Example content of `.orgarc`:

```json
{
  "source": "/home/myname/orga/db",
  "folderDb": "folder-labels.json",
  "moveDb": "move-wiki.json"
}
```

### Folder Labels

A simple label maker for standard office folders written in Node.js.

Data format:

```ts
interface FolderLabelInput {
  meta: {
    categories: Record<string, {
      color: string;
    }>;
  };
  definitions: Array<{
    id: number;
    category: string;
    name: string;
    parts: number;
    [part: string]: string | number;
  }>;
}
```

### Move Wiki

A simple organization app / system for keeping track of moving boxes. Consists of a PWA written in React and a label maker in Node.js.

Data format:

```ts
interface MovingBoxes {
  boxes: Array<{
    id: string;
    type: string;
    content: Array<string>;
    source: string;
    target: string;
    labels: Array<string>;
  }>;
}
```

## License

MIT License (MIT). For more information see [LICENSE](./LICENSE) file.
