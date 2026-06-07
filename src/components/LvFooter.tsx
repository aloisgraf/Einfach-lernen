import Link from "next/link";

export default function LvFooter() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} Lernversum · Eben im Pongau · Salzburg</span>
      <div className="footer-links">
        <Link href="/ueber-mich">Über mich</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/impressum">Impressum</Link>
        <a href="mailto:info@lernversum.at">info@lernversum.at</a>
        <Link href="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
