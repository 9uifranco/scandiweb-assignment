import React from "react";

export const parse = (html: string): React.ReactNode[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const safeTags = [
        "p", "br", "ul", "li", "strong", "em", "b", "i", "a",
        "h1", "h2", "h3", "h4", "h5", "h6"
    ];

    const classNameMap: Record<string, string> = {
        h1: "text-3xl font-bold mb-4",
        h2: "text-2xl font-semibold mb-4",
        h3: "text-xl font-semibold mb-3",
        h4: "text-lg font-medium mb-2",
        h5: "text-base font-medium mb-2",
        h6: "text-sm font-medium mb-1",
        p: "mb-4 text-gray-800",
        ul: "list-disc pl-6 mb-4",
        li: "mb-2",
        strong: "font-bold",
        em: "italic text-gray-700",
        b: "font-bold",
        i: "italic",
        a: "text-blue-600 underline hover:text-blue-800"
    };

    const convertNode = (node: ChildNode, key: number): React.ReactNode => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }

        if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
            const tag = node.tagName.toLowerCase();

            if (!safeTags.includes(tag)) return null;

            const children = Array.from(node.childNodes).map((child, i) =>
                convertNode(child, i)
            );

            const props: any = { key, className: classNameMap[tag] || undefined };

            if (tag === "a") {
                props.href = node.getAttribute("href") ?? "#";
                props.target = "_blank";
                props.rel = "noopener noreferrer";
            }

            return React.createElement(tag, props, children);
        }

        return null;
    };

    return Array.from(doc.body.childNodes)
        .map((node, i) => convertNode(node, i))
        .filter(Boolean);
};
