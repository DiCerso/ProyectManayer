import React from "react";

export const Task = ({name, description,state, priority, date, handleTask, id, idtask, handleDeleteTask, handleTaskEstade, task}) => {
  return (
    <div className="flex justify-between bg-white p-5 mb-5 shadow-md">
      <div>
        <p className="mb-1 text-xl">{name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-xl">{date}</p>
        <p className="mb-1 text-gray-600">{priority}</p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-start gap-2">
        <button className="bg-indigo-600 p-2 text-white uppercase font-bold text-sm rounded-lg" onClick={() => {handleTask(id, idtask)}}>
          Editar
        </button>

        {state ? (
          <button className="bg-sky-600 p-2 text-white uppercase font-bold text-sm rounded-lg" onClick={() => {handleTaskEstade(id,task)}}>
            Completa
          </button>
        ) : (
          <button className="bg-gray-600 p-2 text-white uppercase font-bold text-sm rounded-lg" onClick={() => {handleTaskEstade(id,task)}}>
            Incompleta
          </button>
        )}

        <button className="bg-red-600 p-2 text-white uppercase font-bold text-sm rounded-lg" onClick={() => {handleDeleteTask(id, idtask)}}>
          Eliminar
        </button>
      </div>
    </div>
  );
};
