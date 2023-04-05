const Task = require('../database/models/task');
const Project = require('../database/models/proyect');
const errorResponse = require("../helpers/errorResponse");
const ObjectId = require("mongoose").Types.ObjectId;


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

            const {idtask} = req.params;

            if ([name, description, priority].includes("") || !name || !description || !priority) {
                throw createError(400, "Todos los campos son obligatorios");
            }

            const project = await Project.findById(projectId);

            if (req.user._id.toString() !== project.createdBy.toString()) {
                throw createError(403, "No estás autorizado");
            }

            project.tasks.map(async (task) => {
                try {
                    if(task._id == idtask){
                        let tarea = await Task.findById(idtask);
                        tarea.name = name || tarea.name;
                        tarea.description = description || tarea.description;
                        tarea.priority = priority || tarea.priority;
                        await tarea.save();
                    }
                } catch (error) {
                    return res.status(error.status || 500).json({
                        ok: false,
                        msg: error.message || 'Upss, hubo un error en TASK-UPDATE'
                    })
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

            let {idtask, idproject} = req.params;

            if (!ObjectId.isValid(idtask)) throw createError(400, "No es un ID válido");
            if (!ObjectId.isValid(idproject)) throw createError(400, "No es un ID válido");

            const project = await Project.findById(idproject);
            const task = await Task.findById(idtask);

            if (!task) throw createError(404, "La tarea no encontrado");
            if (!project) throw createError(404, "El proyecto no encontrado");


            if (req.user._id.toString() !== project.createdBy.toString())
            throw createError(401, "No estás autorizado/a");
        
            await task.deleteOne();

            await Project.updateOne({"_id" : idproject}, {$pull : {"tasks" : idtask}});

            return res.status(200).json({
                ok: true,
                msg: 'La tarea ha sido eliminada con exito'
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
            let {_id} = req.body;
            let {id} = req.params


            if (!ObjectId.isValid(_id)) throw createError(400, "No es un ID válido");
            if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

            let project = await Project.findById(id);
            const tasks = await Task.findById(_id);

            if (!tasks) throw createError(404, "La tarea no encontrado");
            if (!project) throw createError(404, "El proyecto no encontrado");

            if (req.user._id.toString() !== project.createdBy.toString())
            throw createError(401, "No estás autorizado/a");

            tasks.state = !tasks.state;

            await tasks.save();

            project = await Project.findById(id).populate('tasks').populate('collaborators');
            

            return res.status(200).json({
                ok: true,
                msg: tasks.state ? "Tarea completada" : "Tarea incompleta",
                data : project
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