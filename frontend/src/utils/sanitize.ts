export const sanitizeHTML = (html: string): string => {
    return html
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, "") // Remove <script> tags
        .replace(/on\w+="[^"]*"/gi, "") // Remove event handlers like onclick=""
        .replace(/javascript:/gi, "") // Remove javascript: URLs
        .replace(/<[^>]+>/g, (tag) => {
            // Allow only safe tags
            const safeTags = [
                "p", "br", "ul", "li", "strong", "em", "b", "i",
                "h1", "h2", "h3", "h4", "h5", "h6", "a"
            ];
            const match = tag.match(/^<\/?([a-z0-9]+)/i);
            return match && safeTags.includes(match[1].toLowerCase()) ? tag : "";
        });
};
