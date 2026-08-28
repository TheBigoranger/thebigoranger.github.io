import type { GitHubRelease } from '@/data/projects'

type ReleaseResponse = {
  tag_name?: unknown
  name?: unknown
  published_at?: unknown
  html_url?: unknown
}

type ReleaseOptions = {
  fetchImpl?: typeof fetch
  timeoutMs?: number
  token?: string
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export async function getLatestGitHubRelease(
  repository: string,
  fallback: GitHubRelease,
  options: ReleaseOptions = {},
): Promise<GitHubRelease> {
  const fetchImpl = options.fetchImpl ?? fetch
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 3000)

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  const token = options.token ?? process.env.GITHUB_TOKEN
  if (token) headers.Authorization = 'Bearer ' + token

  try {
    const response = await fetchImpl(
      'https://api.github.com/repos/' + repository + '/releases/latest',
      { headers, signal: controller.signal },
    )
    if (!response.ok) return fallback

    const data = (await response.json()) as ReleaseResponse
    if (
      typeof data.tag_name !== 'string' ||
      data.tag_name.trim() === '' ||
      typeof data.published_at !== 'string' ||
      !isHttpUrl(data.html_url)
    ) {
      return fallback
    }

    return {
      tagName: data.tag_name,
      name:
        typeof data.name === 'string' && data.name.trim() !== ''
          ? data.name
          : data.tag_name,
      publishedAt: data.published_at,
      url: data.html_url,
      source: 'github',
    }
  } catch {
    return fallback
  } finally {
    clearTimeout(timeout)
  }
}
