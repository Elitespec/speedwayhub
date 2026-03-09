import sample from './news/2025-11-01-sample.md?raw'
import nzSpeedwayIntro from './news/2026-01-03-nz-speedway-intro.md?raw'
import fullContactCombat from './news/2026-01-03-full-contact-combat.md?raw'
import multiMillionInvestment from './news/2026-01-03-multi-million-dollar-investment.md?raw'
import driversAge from './news/2026-01-03-drivers-age-5-to-75.md?raw'
import dirtTrackDigital from './news/2026-01-03-dirt-track-gone-digital.md?raw'
import seasonResults from './news/2026-01-03-2025-2026-season-results.md?raw'
import bradLane from './news/2026-01-12-brad-lane-modifier-champs.md?raw'
import ethanRees from './news/2026-01-12-ethan-rees-world-240s.md?raw'
import glenEagles from './news/2026-01-12-glen-eagles-hat-trick.md?raw'
import waikarakaPark from './news/2026-01-12-waikaraka-park-reopening.md?raw'
import benJenkins from './news/2026-01-12-ben-jenkins-tri-series.md?raw'
import danielThomas from './news/2026-01-10-daniel-thomas-nz-sprintcar.md?raw'
import hodgsonMidgets from './news/2026-01-17-hodgson-nz-midget-champs.md?raw'
import gisborneGiants from './news/2026-02-08-gisborne-giants-teams.md?raw'
import calebIreland from './news/2026-02-22-caleb-ireland-back-to-back.md?raw'
import cowlingSuperSaloon from './news/2026-03-01-cowling-third-super-saloon-crown.md?raw'
import crushersTeams from './news/2026-03-08-crushers-stockcar-teams.md?raw'

export type NewsPostMeta = {
  slug: string
  title: string
  date: string
  trackSlug?: string
  content: string
  image?: string
  excerpt?: string
}

export const newsPosts: NewsPostMeta[] = [
  {
    slug: 'crushers-stockcar-teams',
    title: 'Canterbury Crushers Take Stockcar Teams Title South',
    date: '2026-03-08',
    trackSlug: 'paradise-valley-speedway',
    content: crushersTeams,
    image: '/photos/baypark-speedway.webp',
    excerpt: 'The Canterbury Crushers denied the Rotorua Rascals a rare three-peat at the NZ Stockcar Teams Championship.',
  },
  {
    slug: 'cowling-third-super-saloon-crown',
    title: 'Chris Cowling Claims Third NZ Super Saloon Championship',
    date: '2026-03-01',
    trackSlug: 'meeanee-speedway',
    content: cowlingSuperSaloon,
    image: '/photos/meeanee-speedway.webp',
    excerpt: 'Chris Cowling cements his dominance with a third NZ Super Saloon title at Meeanee Speedway.',
  },
  {
    slug: 'caleb-ireland-back-to-back',
    title: 'Caleb Ireland Makes History With Back-to-Back NZ Stockcar Titles',
    date: '2026-02-22',
    trackSlug: 'woodford-glen-speedway',
    content: calebIreland,
    image: '/photos/woodford-glen-speedway.webp',
    excerpt: 'Only the second driver ever to win consecutive NZ Stockcar Championships, Ireland edged Harley Robb by a single point.',
  },
  {
    slug: 'gisborne-giants-teams',
    title: 'Gisborne Giants Claim First Superstock Teams Title in a Decade',
    date: '2026-02-08',
    trackSlug: 'palmerston-north-speedway',
    content: gisborneGiants,
    image: '/photos/rpis-track.webp',
    excerpt: 'The Giants won their first ENZED Superstock Teams Championship since reforming 10 years ago.',
  },
  {
    slug: 'hodgson-nz-midget-champs',
    title: 'Aaron Hodgson Charges to Glory in 83rd NZ Midget Championship',
    date: '2026-01-17',
    trackSlug: 'baypark-speedway',
    content: hodgsonMidgets,
    image: '/photos/baypark-speedway.webp',
    excerpt: 'Hodgson charged from the 3rd row to win by 1.3 seconds at Baypark. Teenage star Alec Insley was top qualifier.',
  },
  {
    slug: 'ethan-rees-world-240s',
    title: 'Ethan Rees Triumphs in Thrilling World 240s Father-Son Battle',
    date: '2026-01-12',
    trackSlug: 'paradise-valley-speedway',
    content: ethanRees,
    image: '/photos/meeanee-speedway.webp',
    excerpt: 'The 39th World Invitation Superstock Championship ended in dramatic fashion with a father-son duel.',
  },
  {
    slug: 'brad-lane-modifier-champs',
    title: 'Brad Lane Claims Historic Fourth New Zealand Modified Title',
    date: '2026-01-12',
    trackSlug: 'wellington-family-speedway',
    content: bradLane,
    image: '/photos/western-spring.webp',
    excerpt: 'Brad Lane cemented his legacy by securing his fourth NZ Modified Championship at Wellington Family Speedway.',
  },
  {
    slug: 'glen-eagles-hat-trick',
    title: 'Canterbury Glen Eagles Secure Superstock Teams Hat-Trick',
    date: '2026-01-12',
    trackSlug: 'palmerston-north-speedway',
    content: glenEagles,
    image: '/photos/rpis-track.webp',
    excerpt: 'The Glen Eagles made history at Palmerston North by securing a "hat-trick" of wins at the Superstock Teams Extravaganza.',
  },
  {
    slug: 'waikaraka-park-reopening',
    title: 'Waikaraka Park Reopens Following $11 Million Infrastructure Upgrade',
    date: '2026-01-12',
    trackSlug: 'waikaraka-park-speedway',
    content: waikarakaPark,
    image: '/photos/baypark-speedway.webp',
    excerpt: "Auckland's Waikaraka Park has officially reopened, debuting New Zealand's first new speedway track in nearly 25 years.",
  },
  {
    slug: 'ben-jenkins-tri-series',
    title: 'Ben Jenkins Defends Streetstock Tri-Series Crown',
    date: '2026-01-12',
    trackSlug: 'top-of-the-south-speedway',
    content: benJenkins,
    image: '/photos/woodford-glen-speedway.webp',
    excerpt: 'Dunedin driver Ben Jenkins successfully defended his "Lift N Shift" Streetstock Tri-Series title.',
  },
  {
    slug: 'daniel-thomas-nz-sprintcar',
    title: 'Daniel Thomas Dominates to Win NZ Sprintcar Championship',
    date: '2026-01-10',
    trackSlug: 'central-motor-speedway',
    content: danielThomas,
    image: '/photos/riverside-speedway.webp',
    excerpt: 'Thomas led all 25 laps at Central Motor Speedway in Cromwell to win the NZ Sprintcar Championship.',
  },
  {
    slug: '2025-2026-season-results',
    title: '2025/2026 Season Championship Results',
    date: '2026-01-03',
    trackSlug: undefined,
    content: seasonResults,
    image: '/photos/baypark-speedway.webp',
    excerpt: 'The season is heating up. Check out the latest podium finishers from major championships across New Zealand.',
  },
  {
    slug: 'nz-speedway-intro',
    title: "New Zealand's Intense Speedway Scene",
    date: '2026-01-03',
    trackSlug: undefined,
    content: nzSpeedwayIntro,
    image: '/photos/woodford-glen-speedway.webp',
    excerpt: 'From humble beginnings to packed stadiums, New Zealand speedway has a culture unlike any other.',
  },
  {
    slug: 'full-contact-combat',
    title: "It's Not Just Racing\u2014It's Full-Contact Combat on Wheels",
    date: '2026-01-03',
    trackSlug: undefined,
    content: fullContactCombat,
    image: '/photos/riverside-speedway.webp',
    excerpt: 'Stockcars are the gladiators of the dirt. Learn why "using the bumper" is a requirement, not a foul.',
  },
  {
    slug: 'multi-million-dollar-investment',
    title: 'A Multi-Million Dollar Bet on the Future of Roaring Engines',
    date: '2026-01-03',
    trackSlug: undefined,
    content: multiMillionInvestment,
    image: '/photos/ruapuna-speedway.webp',
    excerpt: 'Tracks around the country are upgrading facilities, betting big that the roar of the engines will draw crowds for decades to come.',
  },
  {
    slug: 'drivers-age-5-to-75',
    title: 'The Drivers Range From Age 5 to 75',
    date: '2026-01-03',
    trackSlug: undefined,
    content: driversAge,
    image: '/photos/meeanee-speedway.webp',
    excerpt: 'Speedway is a family affair. See how Ministocks nurture young talent and veterans keep the passion alive.',
  },
  {
    slug: 'dirt-track-gone-digital',
    title: 'The Dirt Track Has Gone Digital',
    date: '2026-01-03',
    trackSlug: undefined,
    content: dirtTrackDigital,
    image: '/photos/greenstone-park-speedway.webp',
    excerpt: 'Live timing, streaming, and data analytics\u2014technology is changing how we experience the dirt track.',
  },
  {
    slug: 'speedwayhub-launch-preview',
    title: 'SpeedwayHub NZ is warming up the grid',
    date: '2025-11-01',
    trackSlug: undefined,
    content: sample,
    image: '/photos/western-spring.webp',
    excerpt: 'We are building the ultimate directory for NZ Speedway. Read about our mission and what comes next.',
  },
]
