const Task = require('../database/models/task');
const Project = require('../database/models/proyect');
const errorResponse = require("../helpers/errorResponse");


module.exports = {
    list: async (req, res) => {
        try {
            return res.status(200).json({
                ok: true,
                msg: 'Lista de Tareas'
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'Upss, hubo un error en TASKS-LIST'
            })
        }
    },
    store: async (req, res) => {
        try {
            const { name, description, priority, project: projectId } = req.body;

            if ([name, description, priority].includes("") || !name || !description || !priority) {
                throw createError(400, "Todos los campos son obligatorios");
            }

            const project = await Project.findById(projectId);

            if (req.user._id.toString() !== project.createdBy.toString()) {
                throw createError(403, "No estás autorizado");
            }
            const taskStore = await Task.create(req.body);
            project.tasks.push(taskStore._id);
            await project.save();
            return res.status(201).json({
                ok: true,
                msg: 'Tarea guardada con éxito',
                task: taskStore
            })
        } catch (error) {
            console.log(error);
            return errorResponse(res, error, "STORE-TASK");
        }

    },
    detail: async (req, res) => {
        try {

            const {idtask, idproject} = req.params;

            let project = await Project.findById(idproject);

            if (req.user._id.toString() !== project.createdBy.toString()) {
                throw createError(403, "No estás autorizado");
            }

            const taskfind = await Task.findById(idtask);

            return res.status(200).json({
                ok: true,
                msg: 'Detalle de la Tarea',
                data: taskfind
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'Upss, hubo un error en TASK-DETAIL'
            })
        }

    },
    update: async (req, res) => {
        try {

            const { name, description, priority, project: projectId } = req.body;

            const {id} = req.params;

            if ([name, description, priority].includes("") || !name || !description || !priority) {
                throw createError(400, "Todos los campos son obligatorios");
            }


            const project = await Project.findById(projectId);

            if (req.user._id.toString() !== project.createdBy.toString()) {
                throw createError(403, "No estás autorizado");
            }

            project.tasks.map(async (task) => {
                if(task._id === id){
                    task.name = name || task.name;
                    task.description = description || task.description;
                    task.priority = priority || task.priority;
                }
            })


            let projectFinal = await project.save();
            return res.status(201).json({
                ok: true,
                msg: 'Tarea guardada con éxito',
                task: projectFinal
            })

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'Upss, hubo un error en TASK-UPDATE'
            })
        }
    },
    remove: async (req, res) => {
        try {
            return res.status(200).json({
                ok: true,
                msg: 'Tarea eliminado'
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'Upss, hubo un error en TASK-REMOVE'
            })
        }
    },
    changeState: async (req, res) => {
        try {
            return res.status(200).json({
                ok: true,
                msg: 'Tarea completada'
            })
        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                msg: error.message || 'Upss, hubo un error en CHANGE-STATE'
            })
        }
    },

}