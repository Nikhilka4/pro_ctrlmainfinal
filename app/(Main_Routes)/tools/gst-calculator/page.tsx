import { GSTEstimatorCard } from '@/components/tools/gst-estimator/gst-estimator-card'
import React from 'react'

const GSTEstimator = () => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center p-4'>
        <div className='w-full h-[15%] text-left'>
            <h1 className='text-3xl font-bold'>GST Estimator</h1>
            <p className='text-lg'>Calcuator your GST</p>
        </div>
        <div className='w-full h-full md:h-[85%] flex items-center justify-center gap-10'>
            <GSTEstimatorCard width='w-[90%] md:w-[70%]' height='h-fit' />
        </div>
    </div>
  )
}

export default GSTEstimator