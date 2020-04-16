const Projects = (() => {

    const projects = [
        {
            title: 'Overview',
            todos: [],
        },
        {
            title: 'Today',
            todos: [],
        },
        {
            title: 'Important',
            todos: [],
        }

    ];

    const addProject = (projectTitle) => {
        const obj = {}
        const todos = [];

        obj.title = projectTitle;
        obj.todos = todos;

        projects.push(obj)


        localStorage.setItem('projects', JSON.stringify(projects));
    }

    const getSelectedProject = () => {
        return localStorage.getItem('selected');
    }

    const selectProject = (projectTitle) => {
        localStorage.setItem('selected', JSON.stringify(projectTitle))
    }

    const getProjects = () => {
        return localStorage.getItem('projects');
    }
    return {
        addProject,
        selectProject,
        getSelectedProject,
        getProjects,
    }
})()

export default Projects;