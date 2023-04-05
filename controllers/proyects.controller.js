const createError = require("http-errors");
const Project = require("../database/models/proyect");
const errorResponse = require("../helpers/errorResponse");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  list: async (req, res) => {
    try {
      const projects = await Project.find().where("createdBy").equals(req.user).select('name client');

      return res.status(200).json({
        ok: true,
        msg: "Lista de Proyectos",
        projects,
      });
    } catch (error) {
      console.log(error);
      return errorResponse(res, error, "LOGIN");
    }
  },
  store: async (req, res) => {
    try {
      const { name, description, client } = req.body;

      if (
        [name, description, client].includes("") ||
        !name ||
        !description ||
        !client
      )
        throw createError(400, "Todos los campos son obligatorios");

      if (!req.user) throw createError(401, "Error de autenticación");

      const project = new Project(req.body);
      project.createdBy = req.user._id;

      //console.log(project)
      const projectStore = await project.save();

      return res.status(201).json({
        ok: true,
        msg: "Proyecto guardado exitosamente",
        project: projectStore,
      });
    } catch (error) {
      console.log(error);
      return errorResponse(res, error, "LOGIN");
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

      const project = await Project.findById(id).populate('tasks').populate('collaborators');


      if (!project) throw createError(404, "Proyecto no encontrado");

      if (req.user._id.toString() !== project.createdBy.toString())
        throw createError(401, "No estás autorizado/a");

      return res.status(200).json({
        ok: true,
        msg: "Detalle del Proyecto",
        project,
      });
    } catch (error) {
      console.log(error);
      return errorResponse(res, error, "LOGIN");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

      const project = await Project.findById(id);

      if (!project) throw createError(404, "Proyecto no encontrado");

      if (req.user._id.toString() !== project.createdBy.toString())
        throw createError(401, "No estás autorizado/a");

      const { name, description, client, dateExpire } = req.body;

      project.name = name || project.name;
      project.description = description || project.description;
      project.client = client || project.client;
      project.dateExpire = dateExpire || project.dateExpire;

      const projecUpdated = await project.save();

      return res.status(201).json({
        ok: true,
        msg: "Proyecto actualizado",
        project: projecUpdated,
      });
    } catch (error) {
      console.log(error);
      return errorResponse(res, error, "LOGIN");
    }
  },
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");

      const project = await Project.findById(id);

      if (!project) throw createError(404, "Proyecto no encontrado");

      if (req.user._id.toString() !== project.createdBy.toString())
        throw createError(401, "No estás autorizado/a");

      await project.deleteOne();

      return res.status(200).json({
        ok: true,
        msg: "Proyecto eliminado con éxito",
      });

    } catch (error) {
      console.log(error);
      return errorResponse(res, error, "LOGIN");
    }
  },
  addCollaborator: async (req, res) => {
    try {

      let { id, projectid } = req.params;

      if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");
      if (!ObjectId.isValid(projectid)) throw createError(400, "No es un ID válido");

      const project = await Project.findById(projectid);

      if (!project) throw createError(404, "Proyecto no encontrado");

      if (req.user._id.toString() !== project.createdBy.toString())
        throw createError(401, "No estás autorizado/a");

      let flag = false;
      project.collaborators.forEach((collaborator) => {
        if (id == collaborator) {
          flag = true;
        }
      })



      if (flag) {

        const project2 = await Project.findById(projectid).populate('tasks').populate('collaborators');


        return res.status(200).json({
          ok: true,
          msg: "El collaborador ya estaba agregado",
          data: project2
        });
      }

      project.collaborators.push(id)
      await project.save();

      const project2 = await Project.findById(projectid).populate('tasks').populate('collaborators');

      return res.status(200).json({
        ok: true,
        msg: "Colaborador agregado",
        data: project2
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        ok: false,
        msg: error.message || "Upss, hubo un error en COLLABORATOR-ADD",
      });
    }
  },
  removeCollaborator: async (req, res) => {
    try {

      let { id, projectid } = req.params;

      if (!ObjectId.isValid(id)) throw createError(400, "No es un ID válido");
      if (!ObjectId.isValid(projectid)) throw createError(400, "No es un ID válido");

      let project = await Project.findById(projectid);

      if (!project) throw createError(404, "Proyecto no encontrado");

      if (req.user._id.toString() !== project.createdBy.toString())
        throw createError(401, "No estás autorizado/a");

      let flag = false;
      project.collaborators.forEach((collaborator) => {
        if (id == collaborator) {
          flag = true;
        }
      })

      if (!flag) {

        project = await Project.findById(projectid).populate('tasks').populate('collaborators');

        return res.status(200).json({
          ok: true,
          msg: "El collaborador no estaba agregado",
          data: project
        });
      }

      await Project.updateOne({ "_id": projectid }, { $pull: { "collaborators": id } });

      project = await Project.findById(projectid).populate('tasks').populate('collaborators');

      return res.status(200).json({
        ok: true,
        msg: "Colaborador eliminado",
        data: project
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({
        ok: false,
        msg: error.message || "Upss, hubo un error en COLLABORATOR-ADD",
      });
    }
  }
};
