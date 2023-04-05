import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";


export const Header = () => {

    const {logout} = useAuth();


    return (
        <div className="px-4 py-5 bg-white border-b">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <h2 className="text-4xl text-sky-600 font-black md:w-1/4">Projects Manager</h2>
            <input type="text" placeholder="Buscar projecto..." className="rounded-lg w:3/3 md:w-1/3 lg:w-1/3 p-2 border"/>
            <div className="flex justify-between items-center gap-4">
                <Link
                 to='/projects'
                 className="font-bold uppercase"
                >
                    Proyectos
                </Link>
                <button
                type="button"
                /* onClick={closeSession} */
                className="text-white text-sm bg-sky-600 p-2 rounded uppercase font-bold"
                onClick={() => {logout()}}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
    );
};