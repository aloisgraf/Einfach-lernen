import Link from "next/link";

export default function LvFooter() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} Einfach Lernen · Eben im Pongau · Salzburg</span>
      <div className="footer-links">
        <Link href="/beratung">Beratung</Link>
        <Link href="/legasthenie-dyskalkulie">Legasthenie &amp; Dyskalkulie</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/kontakt">Kontakt</Link>
        <Link href="/ueber-mich">Über mich</Link>
        <Link href="/datenschutz">Datenschutz</Link>
        <Link href="/impressum">Impressum</Link>
        <a href="mailto:info@einfachlernen-pongau.at">info@einfachlernen-pongau.at</a>
        <Link href="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
