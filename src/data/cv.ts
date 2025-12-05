import { loadBib } from "../lib/loadBib";
const bibPublications = loadBib("Mypaper.bib");

export const experiences = [
	{
		company: 'University of California, Irvine',
		time: 'Sep 2021 - Now',
		title: 'Teaching Assistant / Instructor',
		location: '',
		description: 'Assist Professor Faryar Jabbari in ENGRMAE 80: Dynamics',
	},
	{
		company: 'Hacker Fab at UC Irvine',
		time: 'Sep 2024 - Now',
		title: 'Graduate Student Lead',
		location: '',
		description: 'Lead interdisciplinary research team at <a href="https://kevin200555.github.io/uci-hacker-fab-website/" class="underline text-blue-600" target="_blank">Irvine Hacker Fab</a> on lithography projects, which originated from <a href="https://ethanyxu.com/HackerFab" class="underline text-blue-600" target="_blank">HackerFab</a>',
	},
	{
		company: 'UCI\'s Engineering Design in Industry Program',
		time: 'Jan 2020 - Mar 2020',
		title: 'Mechanical Engineer',
		location: '',
		description: 'Development of personal hygiene device for hot, damp, and sanitized towelette delivery, detailed in <a href="https://projects.eng.uci.edu/projects/2021-2022/edi-whoopy-wipes" class="underline text-blue-600" target="_blank">EDI Whoopy Wipes</a>. It is later commercialized on <a href="https://whoopywipes.com/" class="underline text-blue-600" target="_blank">WhoopyWipes.com</a>',
	},
	{
		company: 'UCI\'s Engineering Design in Industry Program',
		time: 'Sep 2019 - Dec 2019',
		title: 'Mechanical Engineer',
		location: '',
		description: 'Develop hands-free, noninvasive clinical solution for enhanced blood vessel visualization',
	},
	{
		company: 'Strategy consulting intern at PricewaterhouseCoopers',
		time: 'Sep 2017 - Dec 2017',
		title: 'Intership',
		location: '',
		description: 'Provide strategic consulting services to a prominent Electric and Electronic Manufacturing company',
	},
	// {
	// 	company: 'Radium Institute (Institut du Radium)',
	// 	time: '1914 - 1934',
	// 	title: 'Director',
	// 	location: 'Paris, France',
	// 	description: 'Led groundbreaking studies on radioactivity and mentored future Nobel Prize laureates.',
	// },
];

export const education = [
	{
		school: 'Southeast University',
		time: 'Sep 2016 - Jun 2020',
		degree: 'Bachelor\'s degree in Automation' ,
		location: 'Nanjing, China',
		description: '',
	},
	{
		school: 'University of California, Irvine',
		time: 'Sep 2020 - Jun 2021',
		degree: 'Master\'s Degree in Mechanical Engineering ',
		location: 'California, USA',
		description: '',
	},
	{
		school: 'Southeast University',
		time: 'Sep 2021 - now',
		degree: 'Ph.D. student in Mechanical Engineering' ,
		location: 'California, USA',
		description: '',
	},
	// {
	// 	school: 'University of Paris',
	// 	time: '1891 - 1895',
	// 	degree: 'Master’s in Physics and Mathematics',
	// 	location: 'Paris, France',
	// 	description: 'Graduated at the top of her class in physics and second in mathematics.',
	// },
];

export const skills = [
	{
		title: '',
		description: '',
	},
	// {
	// 	title: 'Experimental Techniques',
	// 	description: 'Spectroscopy, Isolation of Radioactive Elements, Radiation Measurement',
	// },
];

export const publications = bibPublications;
//export const publications = 
//[
//	{
//		title: '',
//		authors: '',
//		journal: '',
//		time: '',
//		link: '',
//		abstract: '',
//	},
//	// {
//	// 	title: 'The Radiation of Uranium Compounds',
//	// 	authors: 'Marie Curie',
//	// 	journal: 'Comptes Rendus de l’Académie des Sciences',
//	// 	time: '1898',
//	// 	link: '#',
//	// 	abstract: 'Early research leading to the identification of uranium’s radioactive properties.',
//	// },
//];
//


// New: presentations / conferences
export const presentations = [
	{
		title: 'Distributed optimization of the finite condition number of the Laplacian matrix',
		event: '45th Southern California Control Workshop',
		time: 'April 2025'		,
		link: 'http://terrano.ucsd.edu/jorge/sccw/program.html',
		linkText: 'program',
	},
	{
		title: 'Spline-based parameter varying output feedback synthesis with improved $L_2$ gain',
		event: '45th Southern California Control Workshop',
		time: 'April 2025'		,
		link: 'http://terrano.ucsd.edu/jorge/sccw/program.html',
		linkText: 'program',
	},
  	// Example template (fill with real data and remove the comments):
  // {
  //   title: 'Safety-Critical Control of Multi-Agent Systems',
  //   event: 'American Control Conference (ACC)',
  //   time: 'Jul 2024',
  //   location: 'Denver, CO, USA',
  //   link: ' ',
  //   linkText : ' ' ,
  //   // You can use plain text or HTML links here:
  //   description: 'Contributed talk on control barrier functions for multi-agent coordination.',
  // },
];
