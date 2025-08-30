import Image from 'next/image';
import React from 'react'

const FeatureSection = () => {
  return <div>
    <h1>Features</h1>
    <div className='flex items-center justify-center'>
        {[0, 1, 2].map((i) => (
            <div className='flex items-center justify-center max-w-6xl p-4' key={i}>
                <FeatureCard/>
            </div>
        ))}
    </div>
  </div>;
}

const FeatureCard = () => {
    return <div className='bg-white rounded-lg p-4'>
        <div className='h-48 w-48 relative rounded-full overflow-hidden mb-4'>
            
                <Image src='/landing-splash.jpg' className='rounded-full' alt='feature-1' fill priority />
            
        </div>
        <div>
            <h1>Home Disturbance Monitoring</h1>
            <p>Our home disturbance monitoring system is a cutting-edge security solution that keeps your home safe and your family secure. With real-time alerts, you can rest assured that your home is always protected.</p>
        </div>
    </div>
}

export default FeatureSection