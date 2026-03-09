import type { Event } from '../types'

export const generateICal = (event: Event): string => {
  const startDate = new Date(event.date + (event.startTime ? `T${event.startTime}` : 'T18:00:00'))
  const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000) // 3 hours default

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escape = (str: string): string => {
    return str.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
  }

  const description = [
    event.summary,
    event.url ? `Event link: ${event.url}` : '',
    event.ticketUrl ? `Tickets: ${event.ticketUrl}` : '',
    event.streamUrl ? `Live stream: ${event.streamUrl}` : '',
  ]
    .filter(Boolean)
    .join('\\n')

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SpeedwayHub NZ//Speedway Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@speedwayhub.nz`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(description)}`,
    `LOCATION:${escape(event.trackSlug)}`,
    `URL:${event.url || 'https://speedwayhub.nz/events'}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export const downloadCalendar = (event: Event): void => {
  const ical = generateICal(event)
  const blob = new Blob([ical], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${event.slug}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}



