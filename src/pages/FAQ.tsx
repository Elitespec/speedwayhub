import React from 'react'
import { SEO } from '../components/SEO'
import { SchemaOrg } from '../components/SchemaOrg'

const faqs = [
  {
    question: "What is SpeedwayHub NZ?",
    answer: "SpeedwayHub NZ is a free online directory for New Zealand speedway racing. We list every speedway track, event, and driver across the country to help fans, drivers, and promoters stay connected with the sport."
  },
  {
    question: "Is SpeedwayHub NZ free to use?",
    answer: "Yes! SpeedwayHub NZ is completely free for everyone. No subscriptions, no paywalls, and no donations required. We're funded by advertising to keep the site accessible to all."
  },
  {
    question: "How do I find speedway events near me?",
    answer: "Visit our Events page and filter by region or track. You can also browse our Tracks page to find your nearest speedway and see their upcoming events."
  },
  {
    question: "What racing classes are featured?",
    answer: "We cover all major NZ speedway classes including Superstocks, Stockcars, Sprintcars, Midgets, TQ Midgets, Sidecars, Saloons, Super Saloons, Modifieds, Streetstocks, Production Saloons, Ministocks, and more. Visit our Classes page for detailed information on each."
  },
  {
    question: "How can I add my driver profile?",
    answer: "Drivers can create their own profile by visiting the Drivers page and clicking 'Create Driver Profile'. Fill in your details including car number, classes, home track, and any championship history."
  },
  {
    question: "I'm a track official. How do I update our track information?",
    answer: "Use our Submit page to send us updated track information, event schedules, or photos. We'll review and update the listing as soon as possible."
  },
  {
    question: "How accurate is the event information?",
    answer: "We do our best to keep event information current, but schedules can change due to weather or other factors. Always check the track's official Facebook page or website for the most up-to-date information, especially on race day."
  },
  {
    question: "Can I watch speedway racing online?",
    answer: "Some tracks offer live streaming of their events. Check our Live Timing page for links to streaming services. You can also follow track Facebook pages for live updates during race nights."
  },
  {
    question: "What's the speedway racing season in New Zealand?",
    answer: "The NZ speedway season typically runs from October to April, with most tracks operating on Saturday nights. Some tracks also race on Friday nights or public holidays."
  },
  {
    question: "How much does it cost to attend a speedway event?",
    answer: "Entry prices vary by track and event. Most regular race nights cost around $15-25 for adults, with discounts for children and seniors. Championship events may cost more. Check individual track pages for pricing details."
  },
  {
    question: "Can I bring my own food and drinks?",
    answer: "Policies vary by track. Most speedways have canteens and food vendors on-site. Some allow you to bring your own non-alcoholic drinks. Check with your local track for their specific rules."
  },
  {
    question: "What should I bring to a speedway event?",
    answer: "We recommend: warm clothing (it can get cold at night), ear protection (especially for children), a cushion for hard seats, and cash for food/entry. Some tracks have covered grandstands, but many are open-air."
  },
  {
    question: "How do I become a speedway driver?",
    answer: "Contact your local speedway club to enquire about getting started. Most clubs offer pathways from Youth Ministocks for younger drivers, or you can start in classes like Streetstocks or Production Saloons as an adult. You'll need a competition licence from Speedway New Zealand."
  },
  {
    question: "I found an error on the site. How do I report it?",
    answer: "Please use our Submit page or email us at elitespec2019@gmail.com with the correction. We appreciate your help keeping the information accurate!"
  },
  {
    question: "How can I support SpeedwayHub NZ?",
    answer: "The best way to support us is to share the site with other speedway fans, follow us on Facebook, and use the site regularly. If you're a business, consider advertising with us to reach the NZ speedway community."
  }
]

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)

  return (
    <>
      <SEO
        title="FAQ - SpeedwayHub NZ"
        description="Frequently asked questions about SpeedwayHub NZ and New Zealand speedway racing. Find answers about tracks, events, drivers, and how to get involved."
        path="/faq"
      />
      <SchemaOrg schema={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }} />
      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <section className="space-y-4">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            Frequently Asked <span className="text-hub-red">Questions</span>
          </h1>
          <p className="text-slate-300">
            Got questions about SpeedwayHub NZ or New Zealand speedway racing? Find answers below.
          </p>
        </section>

        <section className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left flex items-center justify-between gap-4"
              >
                <h2 className="text-base font-semibold text-white md:text-lg">
                  {faq.question}
                </h2>
                <span className={`text-hub-red text-2xl transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <p className="text-slate-300 mt-4 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </section>

        <section className="card space-y-4">
          <h2 className="text-xl font-semibold text-white">Still have questions?</h2>
          <p className="text-slate-300">
            Can't find what you're looking for? Get in touch and we'll help you out.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/submit" className="px-6 py-2 bg-hub-red text-white rounded-lg font-semibold hover:bg-hub-red/80 transition-colors">
              Contact Us
            </a>
            <a href="mailto:elitespec2019@gmail.com" className="px-6 py-2 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors">
              Email Us
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
