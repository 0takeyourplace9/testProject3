'use client'
import Image from 'next/image'

export const Loader = () => (
  <div id="loader">
    <Image
      className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
      src="/next.svg"
      alt="Next.js Logo"
      width={180}
      height={37}
      priority
      />
    <div className="spinner"></div>
    <div className="progress">
      <div className="full"></div>
    </div>
  </div>
)