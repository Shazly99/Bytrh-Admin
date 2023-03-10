import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Component from '../../../constants/Component';
import { Container } from 'react-bootstrap';
import { apiheader } from './../../../utils/fetchData';
import Loader from '../../../Components/Shared/Loader/Loader';


export default function DoctorFields() { 
  // get doctor info
  const { id } = useParams();
  const apiInfos = `https://bytrh.com/api/admin/doctors/doctorfields/${id}`;
  const [loadind, setLoadind] = useState(false);
  const [fields, setFields] = useState([]);

  async function getDoctorData() {
    setLoadind(true);
    await axios.get(apiInfos, apiheader )
      .then(res => {
        if (res.status === 200 && res.request.readyState === 4) {
          setFields(res.data.Response);
          setLoadind(false);
        }
      })
      .catch(err => {
       })
  }
  useEffect(() => {
    getDoctorData();
  }, [])



  let navigate = useNavigate();

  const [message, setMessage] = useState('');

  const [loadindAdd, setLoadindAdd] = useState(false);

  const [apiCode, setApiCode] = useState(null);


  async function addField(el) {

    setLoadindAdd(true);
    let { data } = await axios({
      method: 'post',
      url: `https://bytrh.com/api/admin/doctors/medicalfields/add`,
      data: {
        IDDoctor: id,
        IDMedicalField: el
      },
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    });

    setMessage(data.ApiMsg);
    setLoadindAdd(false);

    if (data.Success === true) {
      setApiCode(data.Success);
      setTimeout(() => {
        setApiCode(null);
        setMessage('');
        // navigate('../doctors');
      }, 2000);
    }
  }



  return (
    <Container fluid>
      <div className="dashpage addsales-page py-5">
        <div className="mb-4">
          <div className="note-page">
            <Component.BaseHeader h1={'Doctor Medical Fields'} />

          </div>
        </div>

        {loadind ?
            <Loader />
          :
          <>
            <div className="row d-flex justify-content-center justify-content-md-start align-items-center g-4">

              {fields && fields.map((field, i) => (
                <div key={i} className="col-md-6">
                  <div className="py-3 px-2 rounded-3 shadow bg-light">
                    <input type="checkbox" onChange={() => { addField(field.IDMedicalField) }} className='me-2' id={field.MedicalFieldName} name={field.MedicalFieldName} defaultChecked={field.Checked === 1 ? true : false} />
                    <label htmlFor={field.MedicalFieldName} className='fw-bold'>{field.MedicalFieldName}</label>
                  </div>
                </div>
              ))}

            </div>

            {message.length > 0 ? <p id="alertSave" className={`alert ${apiCode === true ? 'alert-success' : 'alert-danger'} fs-6 py-2 mb-0 mt-3 w-50 text-center mx-auto`}>{message}</p> : ''}

            <div className="submitAdd-buttons mt-4 d-flex justify-content-center align-items-center">
 
              <Component.ButtonBase title={"Save"} bg={"primary"}  path="/doctors "onclick={() => {
                getDoctorData();
                setTimeout(() => {
                  navigate('/doctors');
                }, 1500);
              }} />
              <Component.ButtonBase title={"Cancel"} bg={"primary"} path="/doctors " />
            </div>
          </>

        }
      </div>

    </Container>
  )
}
