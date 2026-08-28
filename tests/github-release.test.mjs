import assert from 'node:assert/strict'
import test from 'node:test'
import { getLatestGitHubRelease } from '../src/lib/github-release.ts'

const fallback = {
  tagName: 'v1.4.0',
  name: 'GriD-LMIA v1.4.0',
  publishedAt: '2026-08-15T02:40:39Z',
  url: 'https://github.com/TheBigoranger/GriD-LMIA/releases/tag/v1.4.0',
  source: 'fallback',
}

test('returns validated latest release metadata', async () => {
  const fetchImpl = async () =>
    new Response(
      JSON.stringify({
        tag_name: 'v1.5.0',
        name: 'GriD-LMIA v1.5.0',
        published_at: '2026-09-01T00:00:00Z',
        html_url: 'https://github.com/TheBigoranger/GriD-LMIA/releases/tag/v1.5.0',
      }),
      { status: 200 },
    )
  const result = await getLatestGitHubRelease('owner/repo', fallback, { fetchImpl })
  assert.equal(result.tagName, 'v1.5.0')
  assert.equal(result.source, 'github')
})

test('falls back for HTTP and malformed responses', async () => {
  const limited = await getLatestGitHubRelease('owner/repo', fallback, {
    fetchImpl: async () => new Response('{}', { status: 403 }),
  })
  const malformed = await getLatestGitHubRelease('owner/repo', fallback, {
    fetchImpl: async () => new Response(JSON.stringify({ tag_name: 'v2' }), { status: 200 }),
  })
  assert.deepEqual(limited, fallback)
  assert.deepEqual(malformed, fallback)
})

test('falls back after timeout', async () => {
  const fetchImpl = (_url, init) =>
    new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    })
  const result = await getLatestGitHubRelease('owner/repo', fallback, {
    fetchImpl,
    timeoutMs: 5,
  })
  assert.deepEqual(result, fallback)
})
