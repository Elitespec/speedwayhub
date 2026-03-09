import React, { useEffect } from 'react'

type AdSenseProps = {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical'
  responsive?: boolean
  className?: string
}

/**
 * Google AdSense Ad Component
 *
 * Usage:
 * <AdSense slot="1234567890" format="auto" responsive={true} />
 */
export const AdSense: React.FC<AdSenseProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = ''
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`border border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-4 text-center ${className}`}>
        <p className="text-xs text-slate-400">AdSense Ad Slot: {slot}</p>
        <p className="text-xs text-slate-500">Ads only show in production</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2571867697851960"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

/**
 * Horizontal banner ad (for top/bottom of pages)
 */
export const AdSenseHorizontal: React.FC<{ slot: string; className?: string }> = ({ slot, className = '' }) => {
  return <AdSense slot={slot} format="horizontal" responsive={true} className={className} />
}

/**
 * Square/rectangle ad (for sidebars)
 */
export const AdSenseRectangle: React.FC<{ slot: string; className?: string }> = ({ slot, className = '' }) => {
  return <AdSense slot={slot} format="rectangle" responsive={true} className={className} />
}

/**
 * In-feed ad (for content lists)
 */
export const AdSenseInFeed: React.FC<{ slot: string; className?: string }> = ({ slot, className = '' }) => {
  return <AdSense slot={slot} format="fluid" responsive={true} className={className} />
}

/**
 * In-article ad (for within content)
 */
export const AdSenseInArticle: React.FC<{ className?: string }> = ({ className = '' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`border border-dashed border-slate-700 bg-slate-900/50 rounded-lg p-4 text-center ${className}`}>
        <p className="text-xs text-slate-400">AdSense In-Article Ad</p>
        <p className="text-xs text-slate-500">Ads only show in production</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-2571867697851960"
        data-ad-slot="6367161783"
      />
    </div>
  )
}
