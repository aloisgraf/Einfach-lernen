import Hero from "@/components/Hero";
import Angebot from "@/components/Angebot";
import UeberUns from "@/components/UeberUns";
import KursVorschau from "@/components/KursVorschau";
import Testimonials from "@/components/Testimonials";
import Kontakt from "@/components/Kontakt";

export default function Home() {
  return (
    <>
      <Hero />
      <Angebot />
      <UeberUns />
      <KursVorschau />
      <Testimonials />
      <Kontakt />
    </>
  );
}
