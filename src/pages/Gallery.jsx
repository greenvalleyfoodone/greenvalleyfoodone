import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Loader4 from "../components/Loader4";

const imageRange = (prefix, start, end, alt) =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const number = start + index;

    return {
      id: `${prefix}-${number}`,
      src: `/images/${prefix}${number}.jpg`,
      alt: `${alt} ${number}`,
    };
  });

const gallerySections = [
  {
    id: "cafe",
    name: "Cafe",
    description: "A warm look at our cafe atmosphere and dining space.",
    images: [
      ...imageRange("cafe", 1, 8, "Cafe image"),
      ...imageRange("cafe", 30, 41, "Cafe image"),
      ...imageRange("cafe", 48, 52, "Cafe image"),
    ],
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Our restaurant interiors, tables and dining experience.",
    images: [
      ...imageRange("cafe", 53, 62, "Restaurant image"),
      {
        id: "restaurant-1",
        src: "/images/restaurent1.jpg",
        alt: "Restaurant interior",
      },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    description: "Behind the scenes in our working kitchen.",
    images: imageRange("out", 1, 7, "Kitchen image"),
  },
  {
    id: "uniform",
    name: "Uniform",
    description: "Our team uniform and service presentation.",
    images: [
      {
        id: "uniform-42",
        src: "/images/cafe42.jpg",
        alt: "Staff uniform",
      },
      {
        id: "uniform-43",
        src: "/images/cafe43.jpg",
        alt: "Staff uniform",
      },
      {
        id: "uniform-47",
        src: "/images/cafe47.jpg",
        alt: "Staff uniform",
      },
    ],
  },
  {
    id: "services",
    name: "Services",
    description: "Friendly service and memorable hospitality.",
    images: [
      ...imageRange("cafe", 43, 47, "Service image"),
      ...imageRange("cafe", 48, 52, "Service image"),
      ...imageRange("service", 27, 46, "Service image"),
    ],
  },
  {
    id: "customers",
    name: "Customers",
    description: "Happy moments shared by our customers.",
    images: imageRange("service", 24, 26, "Customer image"),
  },
  {
    id: "parking",
    name: "Parking Zone",
    description: "Convenient parking for our guests.",
    images: [
      {
        id: "parking-hero",
        src: "/images/hero-2.png",
        alt: "Green Valley parking zone",
      },
    ],
  },
  {
    id: "washrooms",
    name: "Washrooms",
    description: "Clean and comfortable guest facilities.",
    images: imageRange("out", 3, 6, "Washroom image"),
  },
];

const allImages = gallerySections.flatMap((section) =>
  section.images.map((image) => ({
    ...image,
    category: section.name,
  }))
);

const categories = [
  { id: "all", name: "All" },
  ...gallerySections.map((section) => ({
    id: section.id,
    name: section.name,
  })),
];

export default function Gallery() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);

  const activeSection = gallerySections.find(
    (section) => section.id === activeCategory
  );

  const visibleImages =
    activeCategory === "all"
      ? allImages
      : activeSection?.images.map((image) => ({
          ...image,
          category: activeSection.name,
        })) || [];

  return (
    <>
      {loading && <Loader4 onComplete={() => setLoading(false)} />}

      {!loading && (
        <main className="min-h-screen bg-valley-ivory">
          <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-valley-clay mb-4">
                Green Valley Gallery
              </p>

              <h1 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl">
                A look inside Green Valley.
              </h1>

              <p className="mt-5 max-w-2xl text-valley-ink/65 leading-relaxed">
                Explore our cafe, restaurant, kitchen, services and the moments
                that make Green Valley special.
              </p>
            </motion.div>

            <div className="mt-10 overflow-x-auto pb-3">
              <div className="flex min-w-max gap-2">
                {categories.map((category) => {
                  const isActive = activeCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`relative rounded-full px-5 py-2.5 text-sm transition-colors duration-300 ${
                        isActive
                          ? "text-valley-ivory"
                          : "border border-valley-ink/15 text-valley-ink/70 hover:border-valley-clay hover:text-valley-clay"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-gallery-tab"
                          className="absolute inset-0 -z-0 rounded-full bg-valley-clay"
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}

                      <span className="relative z-10">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35 }}
                className="mt-8"
              >
                {activeCategory !== "all" && activeSection && (
                  <div className="mb-8">
                    <h2 className="font-display text-2xl md:text-3xl">
                      {activeSection.name}
                    </h2>
                    <p className="mt-2 text-sm text-valley-ink/55">
                      {activeSection.description}
                    </p>
                  </div>
                )}

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleImages.map((image, index) => (
                      <motion.button
                        key={`${activeCategory}-${image.id}`}
                        type="button"
                        layout
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{
                          duration: 0.45,
                          delay: Math.min(index * 0.035, 0.35),
                        }}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedImage(image)}
                        className={`group relative overflow-hidden rounded-sm bg-valley-ink/5 text-left ${
                          index % 7 === 0
                            ? "sm:row-span-2 sm:min-h-[520px]"
                            : "min-h-[250px]"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={index < 6 ? "eager" : "lazy"}
                          className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-110"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                        <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          <p className="font-mono text-[10px] uppercase tracking-widest text-white/70">
                            {image.category}
                          </p>
                          <p className="mt-1 text-sm">{image.alt}</p>
                        </div>

                        <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs text-valley-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          View
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {visibleImages.length === 0 && (
                  <div className="rounded-sm border border-valley-ink/10 p-12 text-center text-valley-ink/60">
                    No images found in this category.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 25 }}
              className="relative max-h-[90vh] max-w-6xl"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-h-[85vh] max-w-full rounded-sm object-contain"
              />

              <button
                type="button"
                aria-label="Close image"
                onClick={() => setSelectedImage(null)}
                className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl text-black shadow-lg"
              >
                ×
              </button>

              <p className="mt-3 text-center text-sm text-white/75">
                {selectedImage.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}