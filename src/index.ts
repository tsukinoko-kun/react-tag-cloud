import createTagCloud from "TagCloud";
import type { TagCloudOptions } from "TagCloud";
import { useEffect, createElement } from "react";
import type { CSSProperties } from "react";

export type { TagCloudOptions };

type Props = {
    id: string;
    children: Array<string>;
    className?: string;
    options?:
        | TagCloudOptions
        | ((window: Window & typeof globalThis) => TagCloudOptions);
    style?: CSSProperties;
};

const getIsInitialized = (id: string) => {
    const key = "__tag-cloud-" + id;

    if (key in window) {
        return Boolean((window as any)[key]);
    }

    return ((window as any)[key] = false);
};

const setIsInitialized = (id: string, value: boolean) => {
    const key = "__tag-cloud-" + id;

    (window as any)[key] = value;
};

export const TagCloud = (props: Props) => {
    useEffect(() => {
        if (getIsInitialized(props.id)) {
            return;
        }

        const classSelector = props.className
            ? "." +
              props.className
                  .split(/\s+/g)
                  .filter((x) => Boolean(x.trim()))
                  .join(".")
            : "";

        const selector = `#${props.id}` + classSelector;

        const tagCloud = createTagCloud(
            selector,
            props.children,
            props.options
                ? typeof props.options == "function"
                    ? props.options(window)
                    : props.options
                : {}
        );

        setIsInitialized(props.id, true);

        return () => {
            try {
                tagCloud?.destroy();
            } finally {
                setIsInitialized(props.id, false);
            }
        };
    });

    return createElement("div", {
        id: props.id,
        className: props.className,
        style: props.style,
    });
};

export default TagCloud;
