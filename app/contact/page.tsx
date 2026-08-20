import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main id="main">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <h1 className="text-3xl font-semibold sm:text-4xl">Let&apos;s talk.</h1>

        <div className="mt-12 grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/12 p-7">
              <p className="text-xs uppercase tracking-widest text-white/40">Direct</p>
              <a href="mailto:arpeetbarvalia@gmail.com" className="mt-4 block text-lg font-semibold hover:opacity-70">
                arpeetbarvalia@gmail.com
              </a>
              <div className="mt-6 flex flex-col gap-3 font-mono text-sm">
                <a href="https://github.com/abarvalia369" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  GitHub &#8599;
                </a>
                <a href="https://www.linkedin.com/in/arpeet-barvalia/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  LinkedIn &#8599;
                </a>
                <a href="https://www.instagram.com/arpeetbarvalia/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                  Instagram &#8599;
                </a>
              </div>
              <p className="mt-6 font-mono text-xs text-white/40">Clifton, NJ</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
