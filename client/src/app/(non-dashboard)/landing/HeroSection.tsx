"use client"
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
const HeroSection = () => {
  return (
    <div className='relative h-screen w-screen'>
        <Image src='/landing-splash.jpg' alt='hero-bg' fill className='object-cover' priority />
        <div className='absolute inset-0 bg-black opacity-60'>
            <div className='flex flex-col items-center justify-center h-full relative'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className='absolute z-10 transform top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2'
                >
                    <h1 className='text-4xl font-bold text-white'>Rent</h1>
                    <p className='text-5xl text-white'>Rent is a platform for renting assets</p>
                    <div className='flex items-center gap-2'>
                        <input type="text" placeholder='Search for assets' className='bg-white w-full p-2 rounded-md' />
                        <button className='bg-white text-black px-4 py-2 rounded-md'>Search</button>
                    </div>
                </motion.div>
            </div>
        </div>

    </div>
  )
}

export default HeroSection