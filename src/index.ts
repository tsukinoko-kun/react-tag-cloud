import createTagCloud from "TagCloud";
import type { TagCloudOptions } from "TagCloud";
import { useEffect, createElement, useRef } from "react";
import type { CSSProperties } from "react";

export type { TagCloudOptions };

type Tag = {
    text: string;
    onClick?: (event: MouseEvent) => void;
    onClickOptions?: AddEventListenerOptions;
};

type Props<T extends string | Tag> = {
    id?: string;
    children: Array<T>;
    className?: string;
    options?:
        | TagCloudOptions
        | ((window: Window & typeof globalThis) => TagCloudOptions);
    style?: CSSProperties;
    onClickOptions?: AddEventListenerOptions;
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

export const TagCloud = <T extends string | Tag>(props: Props<T>) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (getIsInitialized(props.id) || !ref.current) {
            return;
        }

        if (props.children.length === 0) {
            console.error("TagCloud: No children provided.");
            return;
        }

        const options = props.options
            ? typeof props.options == "function"
                ? props.options(window)
                : props.options
            : {};

        let onClickUsed = false;
        const texts = props.children.map((child) => {
            switch (typeof child) {
                case "string":
                    return child;
                case "object": {
                    if (child.onClick && !onClickUsed) {
                        onClickUsed = true;
                    }

                    if (child.text) {
                        return child.text;
                    }
                }
            }

            return JSON.stringify(child);
        });

        const tagCloud = createTagCloud(ref.current as any, texts, options);

        setIsInitialized(props.id, true);

        if (onClickUsed) {
            const elements = Array.from(
                ref.current.getElementsByClassName(
                    options.itemClass ?? "tagcloud--item"
                )
            ) as Array<HTMLElement>;

            for (const el of elements) {
                for (const child of props.children) {
                    if (typeof child == "string") {
                        if (child === el.innerText) {
                            break;
                        }

                        continue;
                    }

                    if (child.text === el.innerText) {
                        if (child.onClick) {
                            el.addEventListener(
                                "click",
                                child.onClick,
                                child.onClickOptions ?? props.onClickOptions
                            );
                        }

                        break;
                    }
                }
            }
        }

        return () => {
            try {
                tagCloud?.destroy();
            } finally {
                setIsInitialized(props.id, false);
            }
        };
    }, [ref]);

    return createElement("div", {
        id: props.id,
        className: props.className,
        style: props.style,
        ref,
    });
};

export default TagCloud;
