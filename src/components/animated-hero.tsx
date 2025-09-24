'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'

export function AnimatedHero() {
  const [showFinalR, setShowFinalR] = useState(false)

  useEffect(() => {
    // Start the animation after a short delay
    const timer = setTimeout(() => {
      setShowFinalR(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative">
      <Badge variant="secondary" className="mb-4">
        <Lock className="h-3 w-3 mr-1" />
        Privacy-First
      </Badge>
      <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
        <span className="inline-block">Organize.</span>{' '}
        <span className="inline-block">Coordinate.</span>{' '}
        <span className="inline-block">
          Resist
          <span 
            className={`inline-block transition-all duration-700 ease-out ${
              showFinalR 
                ? 'translate-x-0 opacity-100 scale-100' 
                : 'translate-x-4 opacity-0 scale-75'
            }`}
            style={{
              transformOrigin: 'left center',
              animation: showFinalR ? 'slideInR 0.7s ease-out forwards' : 'none'
            }}
          >
            r
          </span>
        </span>
      </h1>
      
      <style jsx>{`
        @keyframes slideInR {
          0% {
            transform: translateX(20px) scale(0.8);
            opacity: 0;
          }
          50% {
            transform: translateX(-2px) scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}