// Common apparel color names from the catalog mapped to a display color.
const colors = {
    white: '#f8f8f6',
    black: '#1c1c1e',
    'navy blue': '#1f2a52',
    navy: '#1f2a52',
    blue: '#3b6fd8',
    'dark wash': '#2d3f5e',
    pink: '#e9a3b8',
    red: '#c63a32',
    cream: '#efe6cf',
    brown: '#7a4a2a',
    gray: '#8d9096',
    grey: '#8d9096',
    beige: '#d9c7a7',
    olive: '#6f7140',
    green: '#2f7d4f',
    yellow: '#e5c33b',
};

/**
 * Small dot showing a product's color next to its name. Unknown names show text only.
 */
export default function ColorSwatch({ color }) {
    const hex = color ? colors[color.trim().toLowerCase()] : null;

    if (!hex) {
        return null;
    }

    return <span aria-hidden="true" className="inline-block size-3 shrink-0 rounded-full ring-1 ring-ink/15" style={{ backgroundColor: hex }} />;
}
