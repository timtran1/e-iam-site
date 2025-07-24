export default function ArrowRightHTML(props = {}) {
    const { width = 18, height = 18, stroke = "currentColor", className = "" } = props;
    
    return `    
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${width}"
    height="${height}"
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="${stroke}"
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
    style="display: inline;"
    class="arrow-right-icon ${className}"
>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
</svg>
`
}
