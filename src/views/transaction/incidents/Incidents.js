import React, { useEffect, useState, useReducer, useRef } from 'react'
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
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CButtonGroup,
  CCardFooter,
  CCardTitle,
  CCardText,
  CLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux'
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

// const fields = ['text','location', 'phone','category','stage','startDate','endDate','createdAt','updatedAt', 'actions']
const fields = ['text','location', 'phone','stage','startDate','endDate','createdAt','updatedAt', 'actions']

const Incidents = () => {
  const [formData, setFormData] =  useReducer(formReducer, {})
  const [submitting, setSubmitting] = useState(false)
  const [fileData, setFileData] = useState(null)

  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [incident, setIncident] = useState();
  const url = useSelector(state => state.baseUrl)
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalDetail, setModalDetail] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [stages, setStages] = useState([])
  const dispatch = useDispatch();
  const [toast, addToast] = useState(0)
  const toaster = useRef()

  const Axs = axios.create({
    headers: {
      'token': localStorage.getItem('shitToken'),
      'Content-Type': 'multipart/form-data'
    },
    baseURL:url
  });

  const Asios = axios.create({
    headers: {
      'token': localStorage.getItem('shitToken')
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
          console.log(error)
      })
  }

  const editIncident = () => {
    alert('Test edit');
  }

  const deleteConfirmation = (incidentData) => {
    setIncident(incidentData)
    setModalDelete(true)
  }

  const deleteIncident = (id) => {
    const countAttachments =  id.incidentAttachments.length;
    var jumlahDelete = 0;
    if(countAttachments > 0){
      id.incidentAttachments.map((value, index) => {
        Asios.delete(`api/incident/${value.id}/delete`,{

        })
        .then(function(response){

        })
        .catch(function(error){
          console.log(error)
        })
        jumlahDelete = jumlahDelete + 1;
      })
    }

    if(countAttachments === jumlahDelete){
      Asios.delete(`api/incident/${id.id}/incidentdelete`, {

      })
      .then(function(response){
        console.log(response)
        setModalDelete(false)
      })
      .catch(function(error){
        console.log(error)
      })
    }
  }

  const detailIncident = (data) => {
    setIncident(data)
    setModalDetail(!modal)
  }

  const DataAttachments = () => {
    if(incident !== undefined){
      return (
        <CCard>
          <CCardHeader>
            Attachments
          </CCardHeader>
          <CCardBody>
            <CForm>
              {
                incident.incidentAttachments.map((value, index) => {
                  var link = `${url}/static/file/${value.filename}`;
                  return (
                    <CRow key={index} >
                      <CFormGroup>
                        <CCol>
                          <CLink href={link} target="_blank">{value.alias}</CLink>
                        </CCol>
                      </CFormGroup>
                    </CRow>
                  )
                })
              }
            </CForm>
          </CCardBody>
        </CCard>
      )
    }else{
      return (
        <CRow>
          Data not found
        </CRow>
      )
    }
  }

  const DataDetail = () => {
    if(incident !== undefined){
      return (
        <CCard>
          <CCardHeader>
            Incident
          </CCardHeader>
          <CCardBody>
              <CForm>
                <CRow>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="incident">Incident/Problem:</CLabel>
                      <CCardText>{incident.text}</CCardText>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="location">Location</CLabel>
                      <CCardText>{incident.location}</CCardText>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="phone">Phone</CLabel>
                      <CCardText>{incident.phone}</CCardText>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="phone">Phone</CLabel>
                      <CCardText>{incident.stageIncidents.text}</CCardText>
                    </CFormGroup>
                  </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      );
    } else {
      return  (
        <CRow>
            Data Not Found
        </CRow>
      )
    }
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
    event.preventDefault()
    setSubmitting(true)
    const dataArray = new FormData()
    dataArray.append("text", formData.incident)
    dataArray.append("location", formData.location)
    dataArray.append("phone", formData.phone)
    dataArray.append("stage_id", formData.stage)
    // loop attachment
    for(var i = 0; i < fileData.length; i++){
      dataArray.append("file",fileData[i]) 
    }
    // send data
    Axs.post('/api/incident/create', dataArray)
    .then(function(response){
      setModalAdd(false);
    })
    .catch(function(error){
      console.log(error)
    })
    setTimeout(() => {
      setSubmitting(false)
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
    setFileData(event.target.files)
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
                    <CLabel htmlFor="incident">Incident/Problem</CLabel>
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
                    <CSelect name="stage" id="stage" onSelect={handleChange}>
                      {
                        stages.map((value, index) => {
                          return <option value={ value.id } key={index}>{ value.text }</option>
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
                    <CInputFile name="file" onChange={handleFile} multiple={true} />
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

        {/* modal detail */}
        <CModal 
          show={modalDetail} 
          onClose={setModalDetail}
          size="lg"
        >
            <CModalHeader closeButton>
              <CModalTitle>Detail Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <DataDetail/>
              <DataAttachments/>
            </CModalBody>
            <CModalFooter>
              <CButton type="submit" color="primary">Save</CButton>
              <CButton 
                color="secondary" 
                onClick={() => {setModalDetail(false)}}
              >Cancel</CButton>
            </CModalFooter>
        </CModal>
        {/* modal delete */}
        <CModal
          show={modalDelete}
          onClose={setModalDelete}
          size="sm"
        >
            <CModalBody>
              Delete data ?
            </CModalBody>
            <CModalFooter>
              <CButton type="submit" color="danger" onClick={() =>{deleteIncident(incident)}}>Delete</CButton>
              <CButton 
                color="secondary" 
                onClick={() => {setModalDelete(false)}}
              >Cancel</CButton>
            </CModalFooter>
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
                    <CButtonGroup>
                      <CButton size="sm" onClick={() => {editIncident()}} color={getBadge('Pending')}>
                        <CIcon name="cil-pencil" />
                      </CButton>
                      <CButton size="sm" onClick={() => {deleteConfirmation(item)}} color={getBadge('Banned')}>
                        <CIcon name="cil-trash" />
                      </CButton>
                      <CButton size="sm" onClick={() => {detailIncident(item)}} color={getBadge('Inactive')}>
                        <CIcon name="cil-description" />
                      </CButton>
                    </CButtonGroup>
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
