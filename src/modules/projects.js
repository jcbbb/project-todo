const Projects = (() => {
	const getSelectedProject = () => {
		return localStorage.getItem('selected');
	};

	const selectProject = (projectTitle) => {
		localStorage.setItem('selected', JSON.stringify(projectTitle));
	};

	const getProjects = () => {
		return localStorage.getItem('projects');
	};

	const projects = JSON.parse(getProjects());

	const addProject = (projectTitle) => {
		const obj = {};
		const todos = [];

		obj.title = projectTitle;
		obj.todos = todos;

		projects.push(obj);

		localStorage.setItem('projects', JSON.stringify(projects));
	};

	return {
		addProject,
		selectProject,
		getSelectedProject,
		getProjects,
	};
})();

export default Projects;
