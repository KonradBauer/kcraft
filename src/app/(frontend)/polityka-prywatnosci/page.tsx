import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Polityka prywatnosci | MCRAFT',
  description: 'Polityka prywatnosci serwisu mcraft.pl - informacje o przetwarzaniu danych osobowych.',
  robots: { index: false },
}

const wrap = 'max-w-[860px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'

export default function PolitykaPrywatnosci() {
  return (
    <div className="bg-cream min-h-screen">
      <div className="bg-ink text-light py-6">
        <div className={wrap}>
          <Link href="/" className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">
            MCRAFT
          </Link>
        </div>
      </div>

      <main className={`${wrap} py-16`}>
        <h1 className="font-light text-[38px] uppercase tracking-[0.01em] text-dark-text mb-4">
          Polityka prywatnosci
        </h1>
        <div className="w-16 h-0.5 bg-accent mb-10" />

        <div className="prose max-w-none text-[15px] leading-[1.85] text-[#56544e] space-y-6">
          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">1. Administrator danych</h2>
            <p>Administratorem danych osobowych jest MCRAFT Michal Macherzynski, NIP: 5742046939, ul. Zolnierzy Wrzesnia 36, 42-152 Wilkowiecko. Kontakt: kontakt@poczta-mcraft.pl, tel. +48 601-488-318.</p>
          </section>

          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">2. Dane zbierane przez formularz kontaktowy</h2>
            <p>Serwis nie posiada formularza kontaktowego. Kontakt odbywa sie przez telefon lub e-mail podany w stopce strony. Dane przekazane w wiadomosci e-mail lub rozmowie telefonicznej przetwarzane sa wylacznie w celu udzielenia odpowiedzi i realizacji zlecenia.</p>
          </section>

          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">3. Pliki cookies</h2>
            <p>Serwis moze uzywac technicznych plikow cookies niezbednych do prawidlowego dzialania strony. Nie uzywamy cookies analitycznych ani marketingowych bez Twojej zgody.</p>
          </section>

          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">4. Prawa uzytkownika</h2>
            <p>Na podstawie RODO (Rozporzadzenie UE 2016/679) przysluguje Ci prawo do: dostepu do danych, ich sprostowania, usuniecia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu. W celu realizacji tych praw skontaktuj sie z administratorem.</p>
          </section>

          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">5. Zewnetrzne serwisy</h2>
            <p>Strona korzysta z Google Maps (mapa w stopce) - podlegajacego osobnej polityce prywatnosci Google LLC. Strona zawiera link do profilu LinkedIn.</p>
          </section>

          <section>
            <h2 className="font-montserrat font-semibold text-[13px] tracking-[0.16em] uppercase text-accent mb-3">6. Zmiany polityki</h2>
            <p>Administrator zastrzega sobie prawo do zmian niniejszej polityki. Data ostatniej aktualizacji: 2026-06-18.</p>
          </section>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-3 font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-accent hover:text-dark-text transition-colors duration-200"
          >
            - Wróc na strone glówna
          </Link>
        </div>
      </main>

      <footer className="bg-ink-3 text-light py-6 mt-16">
        <div className={`${wrap} text-center text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)]`}>
          © 2025 MCRAFT Michal Macherzynski. Wszystkie prawa zastrzezone.
        </div>
      </footer>
    </div>
  )
}
