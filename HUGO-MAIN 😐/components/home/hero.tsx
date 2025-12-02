"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"
import HeroBackground from "./hero-background"


export default function Hero() {


  return (
    <>
      <section className="relative overflow-hidden min-h-screen flex flex-col">
        {/* WebGL Shader Background */}
        <div className="absolute inset-0 z-0">
          <HeroBackground />
        </div>

        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10 flex-1 flex flex-col">
          <div className="mx-auto max-w-4xl text-center flex-1 flex flex-col justify-center">


            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h1 id="main-title" className="text-4xl font-bold tracking-tight bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent sm:text-6xl lg:text-7xl font-[family-name:var(--font-bricolage)]">
                Where Creativity Becomes <strong>Ownership</strong>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mb-12 max-w-2xl text-lg text-white/90 font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Segoe_UI',Roboto,Helvetica,Arial,sans-serif]"
            >
              Your words, your images, your ideas - finally given a place to stand as yours.
              <br />
              Upload your work, let intelligence verify its truth, and anchor it into the immutable world of IP.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-6"
            >


              {/* Buttons Container */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Get started button */}
                <a href="/chat">
                  <div className="group cursor-pointer border border-[#D0FE17] bg-white gap-2 h-[60px] flex items-center p-[10px] rounded-full">
                    <div className="border border-border bg-primary h-[40px] rounded-full flex items-center justify-center text-primary-foreground">
                      <p className="font-medium tracking-tight mr-3 ml-3 flex items-center gap-2 justify-center text-base">
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
                          className="lucide lucide-globe animate-spin"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                        Get started
                      </p>
                    </div>
                    <div className="text-muted-foreground group-hover:ml-4 ease-in-out transition-all size-[24px] flex items-center justify-center rounded-full border-2 border-border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>


              </div>
            </motion.div>
          </div>


        </div>
      </section>
    </>
  )
}
