export interface IAirdropCard {
  logo: string
  category: string
  chains: {}
  mcap: number
  url: string
  tvl: number
  name: string
  status: 'ongoing' | 'upcoming' | 'completed'
  value: number | null
}
