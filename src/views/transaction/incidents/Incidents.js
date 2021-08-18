import React, { useEffect, useState, useReducer } from 'react'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
  CFormGroup,
  CLabel,
  CInput,
  CForm,
  CTextarea,
  CSelect,
  CInputFile,
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'


const getBadge = stage => {
  switch (stage) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }
 }

const fields = ['text','location', 'phone','category','stage','startDate','endDate','createdAt','updatedAt', 'actions']

const Incidents = () => {
  const [formData, setFormData] =  useReducer(formReducer, {})
  const [submitting, setSubmitting] = useState(false)
  const [fileData, setFileData] = useState(null)

  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const url = useSelector(state => state.baseUrl)
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [stages, setStages] = useState([])
  const dispatch = useDispatch();

  const Axs = axios.create({
    headers: {
      token: localStorage.getItem('shitToken')
    },
    baseURL:url
  });

  const getIncidents = () => {
      Axs.get('api/incident',{
      
      })
      .then(function (response) {
        // handle success
        setStatus(response.data.status)
        setIncidents(response.data.data)
      })
      .catch(function (error) {
        
      })
  }

  const getStages = () => {
    Axs.get('api/stage',{

    })
    .then(function (response) {
      setStages(response.data.data)
    })
    .catch(function (error) {
      alert(error)
    })
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);
    console.log(fileData);

    setTimeout(() => {
      setSubmitting(false);
    }, 3000)
  }

  const handleChange = event => {
    const isCheckbox = event.target.type === 'checkbox';
    setFormData({
      name: event.target.name,
      value: isCheckbox ? event.target.checked : event.target.value,
    })
  }

  const handleFile = event => {
      setFileData(event.target.files[0])
  }

  useEffect(() => {
    getIncidents()
    getStages()
  },[])

 
  return (
    <>
      <CRow>
        {/* modal */}
        <CModal 
          show={modalAdd} 
          onClose={setModalAdd}
          size="lg"
        >
          <CForm onSubmit={handleSubmit} method="post">
            <CModalHeader closeButton>
              <CModalTitle>New Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="text">Incident/Problem</CLabel>
                    <CTextarea name="incident" id="incident" rows="5" onChange={handleChange}></CTextarea>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="location">Location</CLabel>
                      <CInput id="location" name="location" placeholder="Lokasi" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="phone">Phone</CLabel>
                      <CInput name="phone" id="phone" placeholder="Nomor Telephone" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="stage">Stage</CLabel>
                    <CSelect name="stage" id="stage" onChange={handleChange}>
                      {
                        stages.map((value, index) => {
                          return <option value={ value.text } key={index}>{ value.text }</option>
                        })
                      }
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="lampiran">File</CLabel>
                    <CInputFile name="lampiran" onChange={handleFile} />
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton type="submit" color="primary">Save</CButton>
              <CButton 
                color="secondary" 
                onClick={() => {setModalAdd(false)}}
              >Cancel</CButton>
            </CModalFooter>
          </CForm>
        </CModal>
        {/* data table */}
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButton onClick={() => {setModalAdd(!modal)}} size="sm" color="primary">
                New Incident
              </CButton>
            </CCardHeader>
          </CCard>
          <CCard>
            <CCardHeader>
              Incidents
              <DocsLink name="CModal"/>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={incidents}
              fields={fields}
              itemsPerPage={5}
              pagination
              columnFilter
              tableFilter
              sorter
              itemsPerPageSelect
              scopedSlots = {{
                'category':
                (item)=>(
                  <td>{item.categoryIncidents.name}</td>
                ),
                'stage':
                (item)=>(
                  <td>{item.stageIncidents.text}</td>
                ),
                'startDate':
                (item)=>(
                  <td>{item.sdate_ticket} {item.stime_ticket}</td>
                ),
                'endDate':
                (item)=>(
                  <td>{item.edate_ticket} {item.etime_ticket}</td>
                ),
                'createdAt':
                (item)=>(
                  <td>{moment(item.createdAt).format('DD-MM-YYYY H:m:s')}</td>
                ),
                'updatedAt':
                (item)=>(
                  <td>{moment(item.updatedAt).format('DD-MM-YYYY H:m:s')}</td>
                ),
                'actions':
                (item)=>(
                  <td>
                    <CButton size="sm"  onClick={() => {}} color={getBadge('Pending')} className="mr-1">
                      Edit
                    </CButton>
                    <CButton size="sm"  onClick={() => {}} color={getBadge('Banned')} className="mr-1">
                      Delete
                    </CButton>
                  </td>
                )
              }}
            />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Incidents
