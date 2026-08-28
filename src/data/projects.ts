export type ProjectLink = {
  label: string
  href: string
  external?: boolean
}

export type GitHubRelease = {
  tagName: string
  name: string
  publishedAt: string
  url: string
  source: 'github' | 'fallback'
}

export type ProjectRecord = {
  slug: 'grid-lmia' | '3d-models'
  title: string
  category: string
  summary: string
  description: string
  tags: string[]
  href: string
  links: ProjectLink[]
  repository?: string
  fallbackRelease?: GitHubRelease
}

export const projects: ProjectRecord[] = [
  {
    slug: 'grid-lmia',
    title: 'GriD-LMIA',
    category: 'Open-source research software',
    summary:
      'A MATLAB/YALMIP assembler for finite certificates of differentiable parameter-dependent LMIs on tensor-product box grids.',
    description:
      'GriD-LMIA represents known data and continuous decision matrices in cell-local Bernstein bases, forms rate-vertex derivatives, and exports finite sufficient conditions to YALMIP.',
    tags: ['MATLAB', 'YALMIP', 'PD-LMI', 'Bernstein polynomials'],
    href: '/project/grid-lmia',
    repository: 'TheBigoranger/GriD-LMIA',
    fallbackRelease: {
      tagName: 'v1.4.0',
      name: 'GriD-LMIA v1.4.0',
      publishedAt: '2026-08-15T02:40:39Z',
      url: 'https://github.com/TheBigoranger/GriD-LMIA/releases/tag/v1.4.0',
      source: 'fallback',
    },
    links: [
      {
        label: 'Documentation',
        href: 'https://www.ethanyxu.com/GriD-LMIA/',
        external: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/TheBigoranger/GriD-LMIA',
        external: true,
      },
      {
        label: 'Paper',
        href: 'https://arxiv.org/abs/2608.03175',
        external: true,
      },
      {
        label: 'Releases',
        href: 'https://github.com/TheBigoranger/GriD-LMIA/releases',
        external: true,
      },
    ],
  },
  {
    slug: '3d-models',
    title: '3D Models',
    category: 'Mechanical design',
    summary:
      'Interactive previews and downloadable source files for practical 3D-printing projects.',
    description:
      'Inspect supported mesh formats in the browser, measure geometry, and download both printable meshes and available SolidWorks source files.',
    tags: ['Three.js', '3D printing', 'SolidWorks'],
    href: '/project/3d-models',
    links: [{ label: 'Open model browser', href: '/project/3d-models' }],
  },
]

export function getProject(slug: ProjectRecord['slug']): ProjectRecord {
  const project = projects.find((item) => item.slug === slug)
  if (!project) throw new Error('Unknown project: ' + slug)
  return project
}
