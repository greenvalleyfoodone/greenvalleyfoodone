export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">Contact</p>
        <h1 className="font-display text-4xl md:text-5xl mb-8">Come find us.</h1>

        <dl className="space-y-6 text-valley-ink/80">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-valley-ink/50 mb-1">Address</dt>
            <dd>Santhamaguluru, Prakasam, Andhra Pradesh</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-valley-ink/50 mb-1">Phone</dt>
            <dd><a href="tel:+919866255533" className="hover:text-valley-clay">98662 55533</a></dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-valley-ink/50 mb-1">Email</dt>
            <dd><a href="mailto:greenvalleyinfo@gmail.com" className="hover:text-valley-clay">greenvalleyinfo@gmail.com</a></dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wide text-valley-ink/50 mb-1">Hours</dt>
            <dd>Restaurant: 7:00 AM – 10:00 PM · Cafe: 5:00 PM – 11:00 PM</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-sm overflow-hidden border border-valley-ink/10 min-h-[320px]">
        <iframe
          title="Green Valley location map"
          src="https://www.google.com/maps?q=Santhamaguluru,Prakasam,Andhra+Pradesh&output=embed"
          className="w-full h-full min-h-[320px] border-0"
          loading="lazy"
        />
      </div>
    </div>
  );
}
