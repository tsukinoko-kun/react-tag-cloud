import createTagCloud from "TagCloud";
import type { TagCloudOptions } from "TagCloud";
import { useEffect, createElement, useRef } from "react";
import type { CSSProperties } from "react";

export type { TagCloudOptions };

type Props<T extends string> = {
    id?: string;
    children: Array<T>;
    className?: string;
    options?:
        | TagCloudOptions
        | ((window: Window & typeof globalThis) => TagCloudOptions);
    style?: CSSProperties;
    onClick?: (tag: T, event: MouseEvent) => void;
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

export const TagCloud = <T extends string>(props: Props<T>) => {
    const ref = useRef<HTMLDivElement>(null);
    const key = [
        props.id,
        props.className,
        JSON.stringify(props.children),
    ].join("-");

    useEffect(() => {
        if (getIsInitialized(key) || !ref.current) {
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

        const tagCloud = createTagCloud(
            ref.current as any,
            props.children,
            options
        );

        setIsInitialized(key, true);

        if (props.onClick) {
            const elements = Array.from(
                ref.current.getElementsByClassName(
                    options.itemClass ?? "tagcloud--item"
                )
            ) as Array<HTMLElement>;

            if (props.onClick) {
                for (const el of elements) {
                    el.addEventListener(
                        "click",
                        (event) => {
                            props.onClick(el.innerText as T, event);
                        },
                        props.onClickOptions
                    );
                }
            }
        }

        return () => {
            try {
                tagCloud?.destroy();
            } finally {
                setIsInitialized(key, false);
            }
        };
    }, [ref, key, props]);

    return createElement("div", {
        id: props.id,
        className: props.className,
        style: props.style,
        ref,
    });
};

export default TagCloud;
