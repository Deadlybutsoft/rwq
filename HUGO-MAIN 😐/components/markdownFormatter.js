export function formatMarkdown(text) {
    if (!text) return text;

    // Replace **text** with bold and italic
    return text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold italic">$1</strong>');
}

export function renderFormattedText(text) {
    const formatted = formatMarkdown(text);
    return { __html: formatted };
}
