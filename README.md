# React Tag Cloud

React component for [Cong Min](https://github.com/cong-min)s [TagCloud](https://github.com/cong-min/TagCloud)

## Installation

```bash
npm install @frank-mayer/react-tag-cloud
```

## Usage

```tsx
import React from "react"
import TagCloud from "@frank-mayer/react-tag-cloud"

const App = () => (
    <TagCloud
        id="web"
        options={(w: Window & typeof globalThis): TagCloudOptions => ({
            radius: Math.min(500, w.innerWidth, w.innerHeight) / 2,
            maxSpeed: "fast",
        })}
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
)
```
