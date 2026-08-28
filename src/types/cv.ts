export interface Experience {
  company: string;
  time: string;
  title: string;
  location?: string;
  description?: string;
}

export interface Presentation {
  title: string;
  time: string;
  event?: string;
  location?: string;
  link?: string;
  linkText?: string;
  description?: string;
}

export interface Education {
  school: string;
  time: string;
  degree: string;
  location?: string;
  description?: string;
  major?: string;
}

export interface Skill {
  title: string;
  description: string;
}

export interface Publication {
  title: string;
  authors: string;
  year: string;
  venue: string;
  doi?: string;
  arxiv?: string;
  link?: string;
  abstract?: string;
  key: string;
  type: string;
}

export function isExperience(element: Experience | Education): element is Experience {
  return 'title' in element && 'company' in element;
}

export function isEducation(element: Education | Experience): element is Education {
  return 'school' in element && 'degree' in element;
}

export function isSkill(element: Skill | Publication): element is Skill {
  return 'description' in element;
}

export function isPublication(element: Skill | Publication): element is Publication {
  return 'authors' in element;
}
