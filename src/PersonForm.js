import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner} from 'react-bootstrap';
import axios from 'axios';

const PersonForm = ({ fetchData, selectedPerson, closeModal, setAlert }) => {
  const [formData, setFormData] = useState({
    id: selectedPerson ? selectedPerson.id : '',
    name: selectedPerson ? selectedPerson.name : '',
    lastName: selectedPerson ? selectedPerson.lastName : '',
    address: selectedPerson ? selectedPerson.address : '',
    gender: selectedPerson ? selectedPerson.gender : '',
    phoneNumber: selectedPerson ? selectedPerson.phoneNumber : '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPerson) {
      setFormData({
        id: selectedPerson?.id || '',
        name: selectedPerson?.name || '',
        lastName: selectedPerson?.lastName || '',
        address: selectedPerson?.address || '',
        gender: selectedPerson?.gender || '',
        phoneNumber: selectedPerson?.phoneNumber || '',
      });
    }
  }, [selectedPerson]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (selectedPerson) {
        await axios.put(`http://localhost:57678/persons/${selectedPerson.id}`, formData);
      } else {
        await axios.post('http://localhost:57678/persons', formData);
      }

      fetchData();
      setFormData({
        id: '',
        name: '',
        lastName: '',
        address: '',
        gender: '',
        phoneNumber: '',
      });
      setAlert({ variant: 'success', message: 'Operación exitosa' });
    } catch (error) {
      setAlert({ variant: 'danger', message: 'Error al realizar la operación' });
      console.error('Error submitting data:', error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };
  const handleClear = () => {
    setFormData({
      id: '',
      name: '',
      lastName: '',
      address: '',
      gender: '',
      phoneNumber: '',
    });
  };

  return (
    <div className="container mt-4">    
      <Form id="form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese Nombre"
            required
            autoComplete="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Apellido:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese Apellido"
            required
            autoComplete="lastName"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Dirección:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese Dirección"
            required
            autoComplete="address"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">
            Género:
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
            required
            autoComplete="gender"
          >
            <option value="">Seleccionar Género</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="No Binario">No binario</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Número de Teléfono:
          </label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-control"
            placeholder="Ingrese Numero Telefonico"
            required
            autoComplete="phoneNumber"
          />
        </div>
        <div className="mb-3 d-flex justify-content-end">
          <Button type="button" className="btn btn-secondary mr-2" onClick={handleClear} title="Haz clic para limpiar los campos">
            <i className="fas fa-eraser"></i> Limpiar
          </Button>
          <Button type="submit" className="btn btn-primary ml-2" title="Haz clic para realizar acción">
            {loading ? <div className="mb-3 d-flex justify-content-center">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Procesando...
            </div> : (
              selectedPerson ? (
                <>
                  <i className="fas fa-edit"></i> Editar
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Agregar
                </>
              )
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PersonForm;
