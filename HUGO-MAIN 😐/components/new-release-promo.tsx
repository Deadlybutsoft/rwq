"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function NewReleasePromo() {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    "https://res.cloudinary.com/dkvkxermy/image/upload/v1764555665/WhatsApp_Image_2025-12-01_at_06.27.37_ztmiyp.jpg",
    "https://res.cloudinary.com/dkvkxermy/image/upload/v1764555664/WhatsApp_Image_2025-12-01_at_06.27.05_qk0hns.jpg",
    "https://res.cloudinary.com/dkvkxermy/image/upload/v1764555663/WhatsApp_Image_2025-12-01_at_06.08.54_1_xorzw5.jpg"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className="relative overflow-hidden pb-24 pt-24">
      {/* Background blur effects - same as FAQ */}
      <div className="bg-primary/20 absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>
      <div className="bg-primary/20 absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full opacity-80 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-[40px] border border-white/10 from-secondary/40 to-secondary/10 bg-gradient-to-b p-8 md:p-12 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Side - Text and Button */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-bricolage)]">
                    Chat. Upload. Protect Your IP.
                  </h2>
                  <p className="text-xl text-white/90">
                    Built to make ownership effortless.
                  </p>
                </div>

                <div className="flex items-center justify-start">
                  <a href="/chat">
                    <div className="group border-2 border-[#D0FE17] bg-[#D0FE17] flex h-[64px] cursor-pointer items-center gap-2 rounded-full p-[11px]">
                      <div className="bg-white flex h-[43px] items-center justify-center rounded-full border-none px-6">
                        <p className="flex items-center justify-center gap-2 font-medium tracking-tight text-black font-[family-name:var(--font-bricolage)]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-globe animate-spin"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                            <path d="M2 12h20"></path>
                          </svg>
                          Get started now
                        </p>
                      </div>
                      <div className="border-border flex size-[26px] items-center justify-center rounded-full border-2 transition-all ease-in-out group-hover:ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-arrow-right transition-all ease-in-out group-hover:rotate-45"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Right Side - Image Carousel */}
              <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={images[currentImage]}
                    alt={`Feature ${currentImage + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {/* Image indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentImage
                        ? "bg-[#D0FE17] w-8"
                        : "bg-white/40 w-2 hover:bg-white/60"
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
