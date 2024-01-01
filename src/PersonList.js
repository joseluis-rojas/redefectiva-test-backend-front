import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Pagination, InputGroup, Form, Spinner, Alert } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import PersonForm from './PersonForm';

import axios from 'axios';

const PersonList = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const maxPageNumbersToShow = 5;
    const [filter, setFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedPersonDetails, setSelectedPersonDetails] = useState(null);
    const [isAddingMode, setIsAddingMode] = useState(false);
    const [alert, setAlert] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:57678/persons');
            const data = Array.isArray(response.data.persons) ? response.data.persons : [];
            setPeople(data);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredList = people.filter((objeto) =>
        Object.values(objeto).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filter.toLowerCase())
        )
    );
    const currentItems = filteredList.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);
    const showEllipsesStart = startPage > 1;
    const showEllipsesEnd = endPage < totalPages;



    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handleFilterChange = (event) => {
        setFilter(event.target.value);
        setCurrentPage(1);
    };

    const openModal = () => setShowModal(true);

    const closeModal = () => {
        setShowModal(false);
        setSelectedPersonDetails(null);
    };

    const openAddModal = () => {
        setIsAddingMode(true);
        openModal();
    };

    const closeAddModal = () => {
        setIsAddingMode(false);
        closeModal();
    };

    const showAlert = (variant, message) => {
        setAlert({ variant, message });
        setTimeout(() => setAlert(null), 5000); // Ocultar la alerta después de 5 segundos
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:57678/persons/' + id);
            fetchData();
            showAlert('success', 'Operación exitosa');
        } catch (error) {
            showAlert('danger', 'Ha ocurrido un problema');
            console.error('Error deleting data:', error);
        }
    };

    const handleView = (id) => {
        const selectedPerson = currentItems.find((person) => person.id === id);
        setSelectedPersonDetails(selectedPerson);
        setSelectedId(id);
        openModal();
    };
    const modalContent = (
        <Modal show={showModal} onHide={isAddingMode ? closeAddModal : closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>{isAddingMode ? 'Agregar Persona' : 'Detalles de la Persona'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <PersonForm
                    fetchData={fetchData}
                    selectedPerson={selectedPersonDetails}
                    closeModal={closeModal}
                    setAlert={setAlert}
                />
            </Modal.Body>
        </Modal>
    );


    return (
        <div>
            {alert && (
                <Alert variant={alert.variant} onClose={() => setAlert(null)} dismissible>
                    {alert.message}
                </Alert>
            )}
            {modalContent}
            <div className="mb-3 d-flex justify-content-center">
                <h1>Lista de Personas</h1>
            </div>
            <div className="mb-3 d-flex justify-content-end">
                <Button className="btn btn-success " onClick={openAddModal}
                    title="Haz clic para agregar una nueva persona">
                    <i className="fas fa-plus"></i> Agregar
                </Button>
            </div>
            <div className="mb-3 d-flex justify-content-end">
                <div className="col-sm-4">
                    <InputGroup >
                        <Form.Control
                            type="text"
                            placeholder="Filtrar..."
                            value={filter}
                            onChange={handleFilterChange}
                        />
                        <InputGroup.Text>
                            <BsSearch />
                        </InputGroup.Text>
                    </InputGroup>
                </div>

            </div>
            {loading ? (
                <>
                    <div className="mb-3 d-flex justify-content-center">
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                        Cargando...
                    </div>
                </>
            ) : (
                <>
                    <Table hover size="sm" responsive className="text-nowrap" >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Dirección</th>
                                <th>Género</th>
                                <th>Teléfono</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((person) => (
                                <tr key={person.id} className={selectedId === person.id ? 'table-primary' : ''}>
                                    <td>{person.id}</td>
                                    <td>{person.name}</td>
                                    <td>{person.lastName}</td>
                                    <td>{person.address}</td>
                                    <td>{person.gender}</td>
                                    <td>{person.phoneNumber}</td>
                                    <td>
                                        <Button className="btn btn-danger mr-2" onClick={() => handleDelete(person.id)} title="Haz clic para eliminar registro">
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                        <Button className="btn btn-primary" onClick={() => handleView(person.id)} title="Haz clic para ver registro">
                                            <i className="fas fa-eye"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {showEllipsesStart && (
                            <Pagination.Ellipsis
                                disabled
                                style={{ pointerEvents: 'none' }}
                            />
                        )}
                        {pageNumbers.slice(startPage - 1, endPage).map((number) => (
                            <Pagination.Item
                                key={number}
                                active={currentPage === number}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </Pagination.Item>
                        ))}
                        {showEllipsesEnd && (
                            <Pagination.Ellipsis
                                disabled
                                style={{ pointerEvents: 'none' }}
                            />
                        )}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />

                    </Pagination>
                    <div className="mx-2 d-flex justify-content-end">
                        Página {currentPage} de {totalPages}
                    </div>
                </>
            )}
        </div>
    );
};

export default PersonList;
