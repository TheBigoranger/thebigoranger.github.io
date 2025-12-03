export const profile = {
	fullName: 'Yicheng Xu',
	title: 'Ph.D. student',
	institute: 'University of California，Irvine',
	research_areas: [
		{title: 'Multi-agent system', description: 'Study of coordination, consensus, and control of interacting agents operating over networked environments, with emphasis on scalability and distributed decision-making.', field: 'MAS'},
		{title: 'Anti-windup control', description: 'Design methods that prevent integrator windup in feedback controllers, ensuring stability and good performance under actuator saturation.', field: 'AW control'},
		{title: 'Event-triggered Control', description: 'A control strategy that updates signals only when necessary, reducing communication and computation while maintaining system stability.', field: 'ETC'},
		{title: 'Linear Parameter-Varying Systems', description: 'Dynamic models whose behavior depends on measurable, time-varying parameters, enabling systematic gain-scheduled or robust control design.', field: 'LPV system'},
		{title: 'Distributed Optimization', description: 'Algorithms that allow multiple agents to cooperatively solve a global optimization problem using only local information and neighbor communication.', field: 'Distributed optimization'},
		{title: 'Control Barrier Function', description:'A formal method for enforcing safety constraints, ensuring system trajectories remain within predefined safe sets through real-time constraint-based control.', field: 'CBF'}		
		// { title: 'Physics', description: 'Brief description of the research interest', field: 'physics' },
	],
}

// Set equal to an empty string to hide the icon that you don't want to display
export const social = {
	email: 'yichex7@uci.edu',
	linkedin: 'https://www.linkedin.com/in/yichengxu97/',
	x: '',
	github: 'https://github.com/TheBigoranger',
	gitlab: '',
	scholar: 'https://scholar.google.com/citations?hl=en&user=-LrIWdoAAAAJ',
	inspire: '',
	arxiv: '',
	orcid: 'https://orcid.org/0009-0008-5478-8004',
}

export const template = {
	website_url: 'https://www.ethanyxu.com', // Astro needs to know your site’s deployed URL to generate a sitemap. It must start with http:// or https://
	menu_left: false,
	transitions: true,
	lightTheme: 'light', // Select one of the Daisy UI Themes or create your own
	darkTheme: 'dark', // Select one of the Daisy UI Themes or create your own
	excerptLength: 200,
	postPerPage: 5,
    base: '' // Repository name starting with /
}

export const seo = {
	//idefault_title: 'Astro Academia',
	//default_description: 'Astro Academia is a template for academic websites.',
	//default_image: '/images/astro-academia.png',
	title: "Yicheng Xu | Ph.D. Candidate in Control & Optimization",
	description: "Research in multi-agent systems, dynamic output feedback, anti-windup control, event-trigger control, distributed optimization, linear parameter varying system and control barrier function.",
	image: "/assets/Yicheng Xu.jpg",
}
