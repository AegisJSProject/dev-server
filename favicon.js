const FAVICON = `<svg width="16" height="16" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
	<rect width="10" height="10" x="0" y="0" rx="1" ry="1"  fill="#${crypto.getRandomValues(new Uint8Array(3)).toHex()}"></rect>
</svg>`;

export default () => new Response(FAVICON, { headers: { 'Content-Type': 'image/svg+xml' }});
