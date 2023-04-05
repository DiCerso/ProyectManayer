import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useForm } from "../hooks/useForm";
import useAuth from "../hooks/useAuth";



export const ModalFormCollaborator = ({ project }) => {

    const { showModal2, handleShowModal2, showAlertModal, showAlert, addcollaborator } = useProjects();
    const { Allusers, users } = useAuth()

    let prioridad = useRef(null)


    useEffect(() => {
        buscar();
    }, []);

    const buscar = async () => {
        try {
            await users();
        } catch (error) {
            console.log(error)
        }

    }

    const { formValues, handleInputChange, reset } = useForm({
        priority: ""
    });

    let { priority } = formValues;

    const handleClosed = () => {
        handleShowModal2()
        showAlertModal("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        priority = prioridad.current.value;
        if ([priority].includes("")) {
            showAlert("Todos los campos son obligatorios");
            return null
        }

        addcollaborator(
            {
                id: priority,
                projectid: project._id
            }
        );

        handleClosed()

        reset()
    }


    return (
        <Transition.Root show={showModal2} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto"
                onClose={handleClosed} static>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        />
                    </Transition.Child>
                    <span className="hidden sm:inline-block sm:align-middle sm:hscreen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleClosed}
                                >
                                    <span className="sr-only">Cerrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-bold text-gray-900">
                                        Agregar un Colaborador
                                    </Dialog.Title>

                                    <form
                                        className='my-10'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="mb-5">
                                            <label htmlFor="priority"
                                                className='uppercase text-gray-500 font-bold text-sm'>Colaborador</label>
                                            <select
                                                className='border w-full p-2 mt-2 placeholder-grey-400 rounded-md'
                                                onChange={handleInputChange}
                                                ref={prioridad}
                                            >
                                                <option value="" hidden
                                                    defaultValue={true} key="">Seleccione...</option>
                                                {project.collaborators.length > 0 ? 
                                                    Allusers.map(user => (
                                                        project.collaborators.map(users => {
                                                            if(users._id != user._id && user._id != project.createdBy){
                                                            return <option value={user._id} key={users.email + users._id}>{users.name}</option>
                                                        }
                                                        })
                                                    ))
                                                    :
                                                    Allusers.map(user => {
                                                        if(user._id != project.createdBy){
                                                        return <option value={user._id} key={user.email + user._id}>{user.name}</option>
                                                        }
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className='flex lg:flex-row lg:items-start gap-2'>
                                            <button type="submit"
                                                className=' bg-sky-600 hover:bg-sky-700 wfull p-3 text-white transition-colors cursor-pointer rounded'
                                            >
                                                Agregar
                                            </button>
                                            <button
                                                className=' bg-red-600 hover:bg-sky-700 wfull p-3 text-white transition-colors cursor-pointer rounded'
                                                onClick={handleClosed}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}