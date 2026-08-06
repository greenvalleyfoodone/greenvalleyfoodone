const images = [
  { src: "/images/gallery-1.jpg", alt: "Filter coffee being poured" },
  { src: "/images/gallery-2.jpg", alt: "Andhra thali spread on a banana leaf" },
  { src: "/images/gallery-3.jpg", alt: "Cafe seating in the evening" },
  { src: "/images/gallery-4.jpg", alt: "Biryani served in a handi" },
  { src: "/images/gallery-5.jpg", alt: "Restaurant kitchen at work" },
  { src: "/images/gallery-6.jpg", alt: "Green Valley entrance" },
];

export default function Gallery() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-valley-clay mb-4">Gallery</p>
        <h1 className="font-display text-4xl md:text-5xl mb-10">A look inside Green Valley.</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img.src} className="aspect-square overflow-hidden rounded-sm bg-valley-ivory border border-valley-ink/10">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-valley-ink/50 mt-8 font-mono">
          Replace these with real photos of your food, cafe and restaurant space.
        </p>
      </section>
    </div>
  );
}
