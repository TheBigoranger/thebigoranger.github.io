import { loadBib } from "../lib/loadBib";
import { experiences, education, presentations, skills } from "./cv_plain";

const bibPublications = loadBib("Mypaper.bib");

export { experiences, education, presentations, skills };
export const publications = bibPublications;

