export const selfDescription = {
  text: `
I am a Ph.D. student at UC Irvine studying Systems and Control under the supervision of Professor Faryar Jabbari. I have an education background in mechanical engineering, especially on optimization and control theory. My current interest is multi-agent systems, anti-windup control, event-triggered control, linear parameter varying systems, distributed optimization on graphs, and control barrier functions.
  `,
  links: [
    {
      match: "Faryar Jabbari",
      url: "https://engineering.uci.edu/users/faryar-jabbari",
    },
    // later you can add more, e.g.:
    // { match: "UC Irvine", url: "https://uci.edu" },
  ],
};

export const experiences = [
	{
		company: 'University of California, Irvine',
		time: 'Sep 2021 - Now',
		title: 'Teaching Assistant / Instructor',
		location: 'Irvine, CA, USA',
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
		location: 'Irvine, CA, USA',
		description: 'Development of personal hygiene device for hot, damp, and sanitized towelette delivery, detailed in <a href="https://projects.eng.uci.edu/projects/2021-2022/edi-whoopy-wipes" class="underline text-blue-600" target="_blank">EDI Whoopy Wipes</a>. It is later commercialized on <a href="https://whoopywipes.com/" class="underline text-blue-600" target="_blank">WhoopyWipes.com</a>',
	},
	{
		company: 'UCI\'s Engineering Design in Industry Program',
		time: 'Sep 2019 - Dec 2019',
		title: 'Mechanical Engineer',
		location: 'Irvine, CA, USA',
		description: 'Develop hands-free, noninvasive clinical solution for enhanced blood vessel visualization',
	},
	{
		company: 'PricewaterhouseCoopers',
		time: 'Sep 2017 - Dec 2017',
		title: 'Strategy consulting Intership',
		location: 'Shanghai, China',
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
		degree: 'Bachelor of Science' ,
		major: 'Automation',
		location: 'Nanjing, China',
		description: '',
		gpa: '3.6/4.0',
	},
	{
		school: 'University of California, Irvine',
		time: 'Sep 2020 - Jun 2021',
		degree: 'Master of Science',
		major: 'Mechanical Engineering',
		location: 'California, USA',
		description: '',
		gpa: '4.0/4.0',
	},
	{
		school: 'University of California, Irvine',
		time: 'Sep 2021 - now',
		degree: 'Ph.D. candidate' ,
		major: 'Mechanical Engineering',
		location: 'California, USA',
		description: '',
		gpa: '3.941/4.0',
	},
	// {
	// 	school: 'University of Paris',
	// 	time: '1891 - 1895',
	// 	degree: 'Master’s in Physics and Mathematics',
	// 	location: 'Paris, France',
	// 	description: 'Graduated at the top of her class in physics and second in mathematics.',
	// },
];

// New: presentations / conferences
export const presentations = [
	{
		title: 'Distributed optimization of the finite condition number of the Laplacian matrix',
		event: '45th Southern California Control Workshop',
		time: 'April 2025'		,
		location: 'San Diego, CA, USA',
		link: 'http://terrano.ucsd.edu/jorge/sccw/program.html',
		linkText: 'program',
	},
	{
		title: 'Discrete-Time Output Feedback under Bounded Actuators: Single and Multi-agent Problems',
		event: '2022 IEEE 61st Conference on Decision and Control (CDC)',
		location: 'Cancun, Mexico',
		time: 'Dec 2022'		,
		link: 'https://ieeexplore.ieee.org/document/9992896',
		linkText: 'Presented Paper',
	},
	{
		title: 'Distributed Optimization of Network Weights for Improved Performance',
		event: '2024 American Control Conference (ACC)',
		location: 'Toronto, ON, Canada',
		time: 'Jul 2024'		,
		link: 'https://ieeexplore.ieee.org/document/10644563',
		linkText: 'Presented Paper',
	},
	{
		title: 'Discrete-Time Output Feedback under Bounded Actuators: Single and Multi-agent Problems',
		event: '2022 IEEE 61st Conference on Decision and Control (CDC)',
		location: 'Toronto, ON, Canada',
		time: 'Jul 2024'		,
		link: 'https://ieeexplore.ieee.org/document/10644563',
		linkText: 'Presented Paper',
	},
	{
		title: 'Optimization Algorithm for Power Flow Calculation Using Graph Theory',
		event: '2019 Chinese Intelligent Systems Conference (CISC)',
		location: 'Haikou, China',
		time: 'Oct 2019'		,
		link: 'https://sias.buaa.edu.cn/info/1007/1281.htm',
		linkText: 'Program',
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

export const skills = [
	{
		title:'Program Language',
		description: 'Matlab, Python, C/C++, Shell, LaTex, HTML',
	},

	{
		title: 'Control Theory',
		description: 'PID Control, Nonlinear Control, Robust Control ($H_{\\infty}$ , $l_2$ gain and gain scheduling),  Event-Triggered Control, Control Barrier Function, Multi-Agent System, Anti-Windup Control, MPC, LQR',
	},

	{
		title:'Mechanical Engineering',
		description: '3D printing, CAD(Solidworks), Lagrangian Mechanic, System Model via first principle, System Identification via Bode Plot, Linear Time-Invariant System, '
	},

	{
		title:'Electric Engineering',
		description:'Micro-Controller Develop (Arduino, STM32, RaspberryPi), PCB desgin(Altium Designer, Easy EDA, KiCad), Oscilloscopes, Soldering, Circuits and Signals, Power \& Energy System (AC,DC), DSP',
	},

	{
		title:'Optimization',
		description: 'Convex Optimization, Semi-definite Programming, Numerical Methods (Augmented Lagrangian, Interior Point Method, variations of Newton\'s method), ADMM',
	}	
	// {
	// 	title: 'Experimental Techniques',
	// 	description: 'Spectroscopy, Isolation of Radioactive Elements, Radiation Measurement',
	// },
];

