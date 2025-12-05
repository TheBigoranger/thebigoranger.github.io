// src/lib/publications.ts
import { profile } from '@/settings'
import type { Publication } from '@/types/cv'

/** Small helper to normalize strings for comparison */
export const normalize = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '')

/* ---------------------- Name parsing from settings.ts ---------------------- */

const nameFromSettings: string = (profile as any)?.fullName ?? ''

const fullNameTokens = nameFromSettings
  .replace(/dr\.\s*/i, '')
  .trim()
  .split(/\s+/)
  .filter(Boolean)

const myLastNameNorm =
  fullNameTokens.length > 0
    ? normalize(fullNameTokens[fullNameTokens.length - 1])
    : ''

const myFirstNameNorm =
  fullNameTokens.length > 0 ? normalize(fullNameTokens[0]) : ''

/* ---------------------- Publication helpers ---------------------- */

export type AuthorPiece = { display: string; isMe: boolean }
export type AnyPublication = Publication | Record<string, any>

export const getYear = (paper: AnyPublication): string =>
  (paper as any).year || ''

export const getVenue = (paper: AnyPublication): string =>
  (paper as any).venue || ''

export const getLink = (paper: AnyPublication): string =>
  (paper as any).link || (paper as any).pdf || (paper as any).url || ''

/**
 * Parse BibTeX-style authors:
 *   "Ong, Pio and Xu, Yicheng and Bena, Ryan M."
 * → [{display: "Pio Ong"}, {display: "Yicheng Xu"}, ...]
 * and mark which one is "me" using profile.fullName.
 */
export const toAuthorPieces = (authors: any): AuthorPiece[] => {
  if (!authors) return []

  let s: string = String(authors).trim()
  if (!s) return []

  const rawAuthors = s
    .split(/\s+and\s+/i)
    .map((t) => t.trim())
    .filter(Boolean)

  const out: AuthorPiece[] = []

  for (const raw of rawAuthors) {
    let last = ''
    let firsts = ''

    if (raw.includes(',')) {
      // "Last, First Middle"
      const parts = raw.split(',').map((x) => x.trim())
      last = parts[0] || ''
      firsts = parts.slice(1).join(' ')
    } else {
      // Fallback: "First Middle Last"
      const toks = raw.split(/\s+/)
      firsts = toks.slice(0, -1).join(' ')
      last = toks[toks.length - 1]
    }

    const display = `${firsts} ${last}`.replace(/\s+/g, ' ').trim()

    const firstNorm = normalize(firsts.split(' ')[0] || '')
    const lastNorm = normalize(last.split(' ').slice(-1)[0] || '')

    const isMe =
      myLastNameNorm &&
      lastNorm === myLastNameNorm &&
      firstNorm.startsWith(myFirstNameNorm)

    out.push({ display, isMe })
  }

  return out
}

/** Sort publications from newest to oldest by year */
export const sortPublicationsNewToOld = <T extends AnyPublication>(
  pubs: T[]
): T[] => {
  return [...pubs].sort((a, b) => {
    const ya = Number(getYear(a) || 0)
    const yb = Number(getYear(b) || 0)
    return yb - ya
  })
}

