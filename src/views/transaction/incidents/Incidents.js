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
  CButtonGroup,
  CCardFooter,
  CCardTitle,
  CCardText,
  CLink,
  CAlert,
  CProgress,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
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
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelAttach, setModalDelAttach] = useState(false)
  const [stages, setStages] = useState([])
  const [stageOpen, setStageOpen] = useState();
  const [attachmentId, setAttachmentId] = useState();
  const [successCreate, setSuccessCreate] = useState(0)
  const [successDelete, setSuccessDelete] = useState(0)
  const [successUpdate, setSuccessUpdate] = useState(0)
  const [failUpdate, setFailUpdate] =  useState(0)
  const dispatch = useDispatch()

  const history = useHistory()

  /**
   * setting base axios
   */
  const Axs = axios.create({
    headers: {
      'token': localStorage.getItem('shitToken'),
      'Content-Type': 'multipart/form-data'
    },
    baseURL:url
  });

  /**
   * setting base axios
   */
  const Asios = axios.create({
    headers: {
      'token': localStorage.getItem('shitToken')
    },
    baseURL:url
  });

  /**
   * get data incidents
   */
  const getIncidents = () => {
    Axs.get('api/incident',{
    
    })
    .then(function(response){
      // handle success
      setStatus(response.data.status)
      setIncidents(response.data.data)
    })
    .catch(function(error){
      history.push('/login')
    })
  }

  /**
   * get data incident
   */
  const getIncident = () => {
    Axs.get(`api/incident/${incident.id}`, {
      
    })
    .then(function(response){
      setIncident(response.data.data)
    })
    .catch(function(error){
      console.log(error)
    })
  }

  /**
   * delete attachment
   */
  const deleteAttachment = () => {
    Asios.delete(`api/incident/${attachmentId}/delete`,{

    })
    .then(function(response){
      setModalDelAttach(false)
      getIncident()
    })
    .catch(function(error){
      console.log(error)
    })
  }

  const deleteAttachConfirm = (id) => {
    setAttachmentId(id)
    setModalDelAttach(true)
  }

  /**
   * data attachment for edit lampiran data attachment
   * @returns 
   */
  const EditDataAttachments = () => {
    if(formData.incident !== undefined){
      return (
        <CCard>
          <CCardHeader>
            Attachments
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {
                    incident.incidentAttachments.map((value, index) => {
                      var link = `${url}/static/file/${value.filename}`;
                      return (
                        <tr key={index}>
                          <td><CLink href={link} target="_blank">{value.alias}</CLink></td>
                          <td><CButton color="danger" onClick={() => {deleteAttachConfirm(value.id)}}>Delete</CButton></td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </table>
              </CCol>
            </CRow>
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

  /**
   * show modal edit incident and setup variabel for formData state
   * @param {*} incidentData 
   */
  const editIncident = (incidentData) => {
    setIncident(incidentData)
    setModalEdit(true)
    setupData("incident",incidentData.text)
    setupData("location",incidentData.location)
    setupData("phone",incidentData.phone)
  }

  /**
   * delete confirmation
   * @param {*} incidentData 
   */
  const deleteConfirmation = (incidentData) => {
    setIncident(incidentData)
    setModalDelete(true)
  }

  /**
   * delete incident
   * @param {*} id 
   */
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
        setSuccessDelete(8)
        getIncidents()
      })
      .catch(function(error){
        console.log(error)
      })
    }
  }

  /**
   * show modal detail incident
   * @param {*} data 
   */
  const detailIncident = (data) => {
    setIncident(data)
    setModalDetail(!modal)
  }

  /**
   * menampilkan detail data
   * @returns 
   */
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

  /**
   * menampilkan detail data
   * @returns 
   */
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
                      <CLabel htmlFor="location">Location:</CLabel>
                      <CCardText>{incident.location}</CCardText>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="phone">Phone:</CLabel>
                      <CCardText>{incident.phone}</CCardText>
                    </CFormGroup>
                  </CCol>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="stage">Stage:</CLabel>
                      <CCardText>{incident.stageIncidents.text}</CCardText>
                    </CFormGroup>
                  </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="created">Created By:</CLabel>
                    <CCardText>{incident.userIncidents.name} {moment(incident.createdAt).format('DD-MM-YYYY H:m:s')}</CCardText>
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

  /**
   * mengambil data stage
   */
  const getStages = () => {
    Axs.get('api/stage',{

    })
    .then(function(response){
      setStages(response.data.data)
    })
    .catch(function(error){
      
    })
  }

  /**
   * get stage open from database
   */
  const getStageOpen = () => {
    Axs.get(`api/stage/1`,{

    })
    .then(function(response){
      setStageOpen(response.data.data)
    })
    .catch(function(error){
    })
  }

  /**
   * menyimaan inputan di formData
   * @param {*} nameParam 
   * @param {*} valueParam 
   */
  const setupData = (nameParam, valueParam) => {
    setFormData({
      name:nameParam,
      value:valueParam
    })
  }

  /**
   * membersihkan inputan diform create incident
   */
  const clearCreate = () => {
    setupData("incident","")
    setupData("location","")
    setupData("phone","")
    setFileData();
  }
  /**
   * melaporkan incident
   * @param {*} event 
   */
  const handleSubmit = event => {
    event.preventDefault()
    setSubmitting(true)
    const dataArray = new FormData()
    dataArray.append("text", formData.incident)
    dataArray.append("location", formData.location)
    dataArray.append("phone", formData.phone)
    dataArray.append("stage_id", stageOpen.id)
    // loop attachment
    for(var i = 0; i < fileData.length; i++){
      dataArray.append("file",fileData[i]) 
    }
    // send data
    Axs.post('/api/incident/create', dataArray)
    .then(function(response){
      setModalAdd(false)
      setSuccessCreate(8)
      getIncidents()
      clearCreate()
    })
    .catch(function(error){
      console.log(error)
    })
    setTimeout(() => {
      setSubmitting(false)
    }, 3000)
  }

  /**
   * update incident
   * @param {*} event 
   */
  const handleUpdate = event => {
    event.preventDefault()
    setSubmitting(true)
    const attachmentArray = new FormData()
    attachmentArray.append("id",incident.id)
    // update incident
    Asios.patch(`/api/incident/${incident.id}/update`, {
      "text":formData.incident,
      "location":formData.location,
      "phone":formData.phone,
      "stage_id":stageOpen.id
    })
    .then(function(response){

    })
    .catch(function(error){
      console.log(error)
    })
    // input attachment
    if(fileData.length > 0){
      // loop attachment
      for(var u = 0; u < fileData.length; u++){
        attachmentArray.append("file",fileData[u])
      }
      Axs.post(`/api/incident/attachment`, attachmentArray)
      .then(function(response){
        setModalEdit(false)
        getIncidents()
      })  
      .catch(function(error){
        console.log(error)
      })
    }

    setTimeout(() => {
      setSubmitting(false)
    }, 3000)
  }

  /**
   * mengambil inputan untuk proses create incident
   */
  const handleChange = event => {
    const isCheckbox = event.target.type === 'checkbox';
    setFormData({
      name: event.target.name,
      value: isCheckbox ? event.target.checked : event.target.value,
    })
  }

  /**
   * mengambil value attachment
   * @param {*} event 
   */
  const handleFile = event => {
    setFileData(event.target.files)
  }

  /**
   * menampilkan modal membuat incident
   */
  const createIncident = () => {
    setModalAdd(true)
  }

  useEffect(() => {
    getIncidents()
    getStages()
    getStageOpen()
  },[])
 
  return (
    <>
      <CRow>
        {/* alert success create */}
        <CCol xs="12" lg="12">
          <CAlert
            color="success"
            show={successCreate}
            closeButton
            onShowChange={setSuccessCreate}
          >
            Incident created
            <CProgress
              striped
              color="success"
              value={Number(successCreate) * 10}
              size="xs"
              className="mb-3"
            />
          </CAlert>
        {/* alert success delete */}
          <CAlert
            color="danger"
            show={successDelete}
            closeButton
            onShowChange={setSuccessDelete}
          >
            Incident deleted
            <CProgress
              striped
              color="danger"
              value={Number(successDelete) * 10}
              size="xs"
              className="mb-3"
            />
          </CAlert>
        </CCol>
        {/* modal */}
        <CModal 
          show={modalAdd} 
          onClose={setModalAdd}
          size="lg"
        >
          <CForm onSubmit={handleSubmit} method="post">
            <CModalHeader>
              <CModalTitle>New Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="incident">Incident/Problem</CLabel>
                    <CTextarea id="incident" name="incident" rows="5" onChange={handleChange} required></CTextarea>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="location">Location</CLabel>
                      <CInput id="location" name="location" placeholder="Lokasi" step="1" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="phone">Phone</CLabel>
                      <CInput id="phone" name="phone" placeholder="Nomor Telephone" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
              </CRow>
              {/* <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="stage">Stage</CLabel>
                    <CSelect name="stage" id="stage" onChange={handleChange}>
                      {
                        stages.map((value, index) => {
                          return <option value={ value.id } key={index}>{ value.text }</option>
                        })
                      }
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow> */}
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="lampiran">File</CLabel>
                    <CInputFile value="" name="file" onChange={handleFile} multiple={true} />
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
        {/* modal edit */}
          <CModal
            show={modalEdit}
            onClose={setModalEdit}
            size="lg"
          >
            <CModalHeader>
              <CModalTitle>Edit Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CForm onSubmit={handleUpdate} method="post">
                <CCard>
                  <CCardHeader>
                    Update Incident
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xs="12">
                        <CFormGroup>
                          <CLabel htmlFor="incident">Incident/Problem</CLabel>
                          <CTextarea name="incident" id="incident" rows="5" onChange={handleChange} value={formData.incident || ""} required></CTextarea>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol sx="6">
                        <CFormGroup>
                            <CLabel htmlFor="location">Location</CLabel>
                            <CInput id="location" name="location" placeholder="Lokasi" step="1" onChange={handleChange} value={formData.location || ''} required />
                        </CFormGroup>
                      </CCol>
                      <CCol sx="6">
                        <CFormGroup>
                            <CLabel htmlFor="ephone">Phone</CLabel>
                            <CInput name="ephone" id="ephone" placeholder="Nomor Telephone" onChange={handleChange} defaultValue={formData.phone || ''} required />
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol sx="6">
                        <CFormGroup>
                          <CLabel htmlFor="efile">File</CLabel>
                          <CInputFile name="efile" onChange={handleFile} multiple={true} />
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs="12" className="text-right">
                        <CButton type="submit" color="primary">Update</CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
                <EditDataAttachments/>
              </CForm>
            </CModalBody>
            <CModalFooter>
              <CButton 
                  color="secondary" 
                  onClick={() => {setModalEdit(false)}}
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
        {/* modal delete attachment */}
        <CModal
          show={modalDelAttach}
          onClose={setModalDelAttach}
          size="sm"  
        >
          <CModalBody>
            Delete attachment ?
          </CModalBody>
          <CModalFooter>
            <CButton type="submit" color="danger" onClick={() =>{deleteAttachment()}}>Delete</CButton>
            <CButton 
              color="secondary" 
              onClick={() => {setModalDelAttach(false)}}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        {/* data table */}
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButton onClick={() => {createIncident()}} size="sm" color="primary">
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
                      <CButton size="sm" onClick={() => {editIncident(item)}} color={getBadge('Pending')}>
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
