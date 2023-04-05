import React from "react";

export const Collaborator = ({name, mail, id, projectid, removecollaborator}) => {
  return (
    <div  className="bg-white border shadow-md rounded p-5 justify-between flex items-center">
    <p className="font-bold uppercase">
      {name}
      <span className="text-gray-600 lowercase">
        | {mail}
      </span>
    </p>
    <div>
  
          <button 
          className='bg-red-600 p-2 text-white uppercase font-bold text-sm rounded-lg'
            onClick={() => {removecollaborator(id, projectid)}}
          >
              Eliminar
          </button>
     
   
    </div>
  </div>
  );
};