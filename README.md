<p align="center">
    <img src="https://raw.githubusercontent.com/cong-min/TagCloud/master/examples/tagcloud.gif" />
</p>

<h1 align="center">React Tag Cloud</h1>

Port of [Cong Min](https://github.com/cong-min)s [TagCloud](https://github.com/cong-min/TagCloud) as a React Component

## Installation

### npm

```bash
npm install @frank-mayer/react-tag-cloud
```

### yarn

```bash
yarn add @frank-mayer/react-tag-cloud
```

### pnpm

```bash
pnpm add @frank-mayer/react-tag-cloud
```

### bun

```bash
bun add @frank-mayer/react-tag-cloud
```

## Usage

Since this component is based on a non-React library, it uses the `useEffect` hook and cannot be rendered on the server.

The component can be imported as a named export or as a default export (useful for lazy loaded components).

The `options` property can modify the behaviour of the component. You can provide the options as a `object` or as a `function` that returns this `object`.
If you provide a `function`, the `window` object will be passed as an argument.
This is useful if you want to use the window size to calculate the radius of the tag cloud.

Pass an `Array` of `string`s as children to the component. This will be used as the tags.

```tsx
import React from "react";
import { TagCloud } from "@frank-mayer/react-tag-cloud";
// same as: import TagCloud from "@frank-mayer/react-tag-cloud"

const App = () => (
    <TagCloud
        options={(w: Window & typeof globalThis): TagCloudOptions => ({
            radius: Math.min(500, w.innerWidth, w.innerHeight) / 2,
            maxSpeed: "fast",
        })}
        onClick={(tag: string, ev: MouseEvent) => alert(tag)}
        onClickOptions={{ passive: true }}
    >
        {[
            "VSCode",
            "TypeScript",
            "React",
            "Preact",
            "Parcel",
            "Jest",
            "Next",
            "ESLint",
            "Framer Motion",
            "Three.js",
        ]}
    </TagCloud>
);
```
