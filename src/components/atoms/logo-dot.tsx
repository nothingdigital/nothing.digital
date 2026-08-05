/**
 * Picks a logo-dot color once per session and applies it before first paint,
 * so refresh keeps the same color with no yellow flash.
 */
export const logoDotColorScript = `(function(){var c=["#fbbf24","#0ea5e9","#ef4444","#10b981"],k="nd-logo-dot",v=sessionStorage.getItem(k);if(!v||c.indexOf(v)<0){v=c[Math.floor(Math.random()*c.length)];sessionStorage.setItem(k,v)}document.documentElement.style.setProperty("--logo-dot",v)})();`;

export function LogoDot() {
  return (
    <span className="italic" style={{ color: "var(--logo-dot)" }}>
      .
    </span>
  );
}
