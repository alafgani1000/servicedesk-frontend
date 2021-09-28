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
  CTooltip,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector, } from 'react-redux'
import moment from 'moment'
import Swal from 'sweetalert2'
import io from 'socket.io-client'

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
const fields = ['text','user','location', 'phone','stage', 'category', 'team', 'startDate','endDate','createdAt', 'actions']

const Incidents = () => {
  const [formData, setFormData] =  useReducer(formReducer, {})
  const [submitting, setSubmitting] = useState(false)
  const [fileData, setFileData] = useState("")
  const imageRef = useRef()

  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const [incident, setIncident] = useState();
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalDetail, setModalDetail] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelAttach, setModalDelAttach] = useState(false)
  const [modalCreateTicket, setModalCreateTicket] = useState(false)
  const [modalResolve, setModalResolve] = useState(false)
  const [stages, setStages] = useState()
  const [teams, setTeams] = useState([])
  const [timeInterval, setTimeInterval] = useState('')
  const [categories, setCategories] = useState([])
  const [stageOpen, setStageOpen] = useState();
  const [attachmentId, setAttachmentId] = useState()
  const [successCreate, setSuccessCreate] = useState(0)
  const [successDelete, setSuccessDelete] = useState(0)
  const [resolveText, setResolveText] = useState("")
  const [successUpdate, setSuccessUpdate] = useState(0)
  const [failUpdate, setFailUpdate] = useState(0)
  const [stateIncidentSearch, setStateIncidentSearch] = useState("")

  const url = useSelector(state => state.baseUrl)
  const role = useSelector(state => state.role)
  const incidentSearch = useSelector(state => state.incidentSearch)
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
    if(incident !== undefined){
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
    setupData("eincident",incidentData.text)
    setupData("elocation",incidentData.location)
    setupData("ephone",incidentData.phone)
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
      let color = ''
      if(incident.stageIncidents.text === 'New'){
        color = 'info'
      }else if(incident.stageIncidents.text === 'Open'){
        color = 'warning'
      }else if(incident.stageIncidents.text === 'Resolve'){
        color = 'primary'
      }else if(incident.stageIncidents.text === 'Close'){
        color = 'success'
      }else if(incident.stageIncidents.text === 'Archive'){
        color = 'secondary'
      }
      return (
        <CCard style={{boxShadow:'1px 1px 1px 1px silver'}}>
          <CCardHeader>
            <h5>Attachments</h5>
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
      let color = ''
      if(incident.stageIncidents.text === 'New'){
        color = 'info'
      }else if(incident.stageIncidents.text === 'Open'){
        color = 'warning'
      }else if(incident.stageIncidents.text === 'Resolve'){
        color = 'primary'
      }else if(incident.stageIncidents.text === 'Close'){
        color = 'success'
      }else if(incident.stageIncidents.text === 'Archive'){
        color = 'secondary'
      }
      return (
        <CCard style={{boxShadow:'1px 1px 1px 1px silver'}}>
          <CCardHeader>
            <h5>Incident</h5>
          </CCardHeader>
          <CCardBody>
              <CForm>
                <CRow>
                  <CCol>
                    <CFormGroup>
                      <CLabel htmlFor="incident" style={{fontWeight:'bold'}}>Incident/Problem:</CLabel>
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
                      <CCardText><CBadge color={color} style={{fontWeight:'bolder', fontSize:'12px'}}>{incident.stageIncidents.text}</CBadge></CCardText>
                    </CFormGroup>
                  </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="created">Created By:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontWeight:'bolder', fontSize:'12px'}} >{incident.userIncidents.name.charAt(0).toUpperCase() + incident.userIncidents.name.slice(1)} {moment(incident.createdAt).format('DD-MM-YYYY H:m:s')}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="ticket">Ticket:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontSize:'12px'}}>{incident.ticket}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="from">From:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontSize:'12px'}}>{incident.sdate_ticket} {incident.stime_ticket}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="until">Until:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontSize:'12px'}}>{incident.edate_ticket} {incident.etime_ticket}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="resolve">Resolve Date:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontSize:'12px'}}>{incident.resolve_date} {incident.resolve_time}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="close">Close:</CLabel>
                    <CCardText><CBadge color="secondary" style={{fontSize:'12px'}}>{incident.close_date} {incident.close_time}</CBadge></CCardText>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="resdesc">Category:</CLabel>
                    <CCardText>{(incident.categoryIncidents === null) ? "" : incident.categoryIncidents.name} ({(incident.categoryIncidents === null) ? "" : incident.categoryIncidents.time_interval} Jam)</CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="team">Team IT:</CLabel>
                    <CCardText>{(incident.teamIncidents === null) ? "" : incident.teamIncidents.name}</CCardText>
                  </CFormGroup>
                </CCol>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="team">Technician:</CLabel>
                    <CCardText>{(incident.technicianIncident === null) ? "" : incident.technicianIncident.name.charAt(0).toUpperCase() + incident.technicianIncident.name.slice(1)}</CCardText>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="resdesc">Resolve Description:</CLabel>
                    <CCardText>{incident.resolve_text}</CCardText>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CFormGroup>
                  <CCol>
                      <CLabel htmlFor="timeresolve">Resolve Time:</CLabel>
                      <CCardText>{((incident.interval_resolve - (incident.interval_resolve % 60)) / 60) } Hours {incident.interval_resolve  % 60} Minutes</CCardText>
                  </CCol>
                </CFormGroup>
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
   * mengambil data team
   */
  const getTeams = () => {
    Axs.get('api/team', {

    })
    .then(function(response){
      setTeams(response.data.data)
    })
    .catch(function(error){

    })
  }

  /**
   * mengambil data category
   */
  const getCategories = () => {
    Axs.get('api/category',{

    })
    .then(function(response){
      setCategories(response.data.data)
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
    setFileData("");
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
      const socket = io(url);
      socket.emit('newIncident', response.data.data)
      setModalAdd(false)
      setSuccessCreate(8)
      getIncidents()

      setupData("incident","")
      setupData("location","")
      setupData("phone","")
      imageRef.current.value = ""
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
    if(fileData !== null){
      Asios.patch(`/api/incident/${incident.id}/update`, {
        "text":formData.eincident,
        "location":formData.elocation,
        "phone":formData.ephone,
        "stage_id":stageOpen.eid
      })
      .then(function(response){
        
      })
      .catch(function(error){
        console.log(error)
      })
      
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
    }else{
      Asios.patch(`/api/incident/${incident.id}/update`, {
        "text":formData.eincident,
        "location":formData.elocation,
        "phone":formData.ephone,
        "stage_id":stageOpen.eid
      })
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
    setFileData("")
  }

  useEffect(() => { 
    // setStateIncidentSearch(incidentSearch)
    getIncidents()
    getStages()
    getStageOpen()
    getTeams()
    getCategories()
  },[])

  /**
   * show modal input ticket
   * @param {*} incident 
   */
  const showModalCreateTicket = (incident) => {
    setIncident(incident)
    setModalCreateTicket(true)
  }

  const showModalResolve = (incident) => {
    setIncident(incident)
    setModalResolve(true)
  }
 
  /**
   * 
   * @param {*} props 
   * @returns 
   */
  const ButtonDelete = (props) => {
    if(props.role === 'guest'){
      if(props.stage === 'New'){
        return (
          <CTooltip content="Delete" placement="top-end">
            <CButton size="sm" onClick={() => {deleteConfirmation(props.item)}} color={getBadge('Banned')}>
              <CIcon name="cil-trash" />
            </CButton>
          </CTooltip>
        )
      }else{
        return ""
      }
    }else{
      return ""
    }
  }
  
  /**
   * component buton input tincket
   * @param {*} props 
   * @returns 
   */
  const ButtonCreateTicket = (props) => {
    if(props.role === "admin"){
      if(props.stage === "New"){
        return (
          <CTooltip content="Create ticket" placement="top-end">
            <CButton size="sm" onClick={() => {showModalCreateTicket(props.item)}} color="primary">
              <CIcon name="cil-av-timer" />
            </CButton>
          </CTooltip>
        )
      }else{
        return ""
      }
    }else{
      return ""
    }
  }

  /**
   * component button resolve
   * @param {*} props 
   * @returns 
   */
  const ButtonResolve = (props) => {
    if(props.role === "technician"){
      if(props.stage === "Open"){
        return (
          <CTooltip content="Resolve" placement="top-end">
            <CButton size="sm" color="success" onClick={() => {showModalResolve(props.item)}}>
              <CIcon name="cil-check-circle"/>
            </CButton>
          </CTooltip>
        )
      }else{
        return ""
      }
    }else{
      return ""
    }
  }

  /**
   * stage component
   * @param {*} props 
   * @returns 
   */
  const Stage = (props) => {
    let color = "info"
    if(props.stage === "New"){
      color = "info"
    }else if(props.stage === "Open"){
      color = "warning"
    }else if(props.stage === "Resolve"){
      color = "primary"
    }else if(props.stage === "Close"){
      color = "success"
    }else if(props.stage === "Archive"){
      color = "seccondary"
    }
    return (
      <CBadge color={color}>{props.stage}</CBadge>
    )
  }

  /**
   * category component
   * @param {*} props 
   * @returns 
   */
  const Category = (props) => {
    let bgcolor = ""
    let color = ""
    if(props.category === 'GOLD'){
      bgcolor = "#DAA520"
      color = "white"
    }else if(props.category === 'SILVER'){
      bgcolor = "#C0C0C0"
      color = "white"
    }else if(props.category === "BRONZE"){
      bgcolor = "#cd7f32"
      color= "white"
    }else if(props.category === "EARTH"){
      bgcolor = "#70483c"
      color = "white"
    }
    return (
      <CBadge style={{'backgroundColor':bgcolor, 'color':color}}>{props.category}</CBadge>
    )
  }

  /**
   * button close component
   * @param {*} props 
   * @returns 
   */
  const ButtonClose = (props) => {
    if(props.role === "admin"){
      if(props.stage === "Resolve"){
        return (
          <CTooltip content="Close" placement="top-end">
            <CButton size="sm" color="danger" onClick={() => {handleClose(props.item)}}>
              <CIcon name="cil-book"/>
            </CButton>
          </CTooltip>
        )   
      }else{
        return ""
      }
    }else{
      return ""
    }
  }

  /**
   * handle change category
   * @param {*} event 
   */
  const handlCreateTicket = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    })
    // get data category
    if(event.target.value !== ""){
      Axs.get(`api/category/${event.target.value}`, {

      })
      .then(function(response){
        setTimeInterval(response.data.data.time_interval)
      })
      .catch(function(error){
        console.log(error)
      })
    }else{
      setTimeInterval('')
    }
  }

  /**
   * handle submit create ticket
   * @param {*} event 
   */
  const handleInputTicket = event => {
    event.preventDefault()
    Asios.patch(`api/incident/${incident.id}/ticket`, {
      team_id:formData.team,
      category_id:formData.category
    })
    .then(function(response){
      setModalCreateTicket(false)
      Swal.fire({
        title:'Notifaction',
        width: 600,
        padding: '3m',
        html:'<b>NOMOR TICKET : '+response.data.data.ticket+'</b><br><b>Dari <span class="badge bg-warning text-white">'+response.data.data.sdate_ticket+' '+response.data.data.stime_ticket+' </span> Sampai <span class="badge bg-warning text-white">'+response.data.data.edate_ticket+ ' '+response.data.data.etime_ticket+'</span></b> '
      })
      // socket io notif
      const socket = io(url);
      socket.emit('inputTicket', response.data.notifId);
    })
    .catch(function(error){
      console.log(error);
    })
  }

  const Toast =  Swal.mixin({
    toast:true,
    position:'top-end',
    showConfirmButton:false,
    time:3000,
    timerProgressBar:true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const resfresh = () => {
    getIncidents()
    dispatch({type: 'set', incidentSearch: ''})
  }

  /**
   * handle resolve incident
   * @param {*} event 
   */
  const handleResolve = event => {
    event.preventDefault()
    Asios.patch(`api/incident/${incident.id}/resolve`, {
      'resolve_text':resolveText
    })
    .then(function(response){
      setModalResolve(false)
      // notification
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Resolved',
        showConfirmButton: false,
        timer: 1500
      })
      // send socket io
      const socket = io(url)
      socket.emit('resolveIncident', response.data.notifId);
    })
    .catch(function(error){
      console.log(error)
    })
  }

  /**
   * close incident
   * @param {*} item 
   */
  const handleClose = (item) => {
    setIncident(item)
    Swal.fire({
      icon: 'question',
      title: 'Close Incident ?',
      confirmButtonText: 'Close Incident',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        Axs.patch(`api/incident/${item.id}/close`,{

        })
        .then(response => {
          const socket = io(url)
          socket.emit('closeIncident', response.data.datas)
          Swal.showValidationMessage(
            `Incident ${response.data.message}`
          )
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Request failed: ${error.message}`
          )
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
    .then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Notifification'
        })
      }
    })
  }

  const reset = () => {
    imageRef.current.value = ""
    setupData("incident","")
    setupData("location","")
    setupData("phone","")
    setFileData("")
  }

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
        {/* modal resolve incident */}
        <CModal
          show={modalResolve}
          onClose={setModalResolve}
          size=""
        >
          <CForm onSubmit={handleResolve} method="post">
            <CModalHeader>
              <CModalTitle>Resolve</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol>
                  <CFormGroup>
                    <CLabel htmlFor="incident">Description resolve</CLabel>
                    <CTextarea id="resolve_text" name="resolve_text" rows="5" onChange={event => setResolveText(event.target.value)} required></CTextarea>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CModalFooter>
                <CButton type="submit" color="primary">Save</CButton>
                <CButton 
                  color="secondary" 
                  onClick={() => {setModalResolve(false)}}
                >Cancel</CButton>
              </CModalFooter>
            </CModalBody>
          </CForm>
        </CModal>
        {/* modal create incident */}
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
                    <CTextarea id="incident" name="incident" rows="5" onChange={handleChange} value={formData.incident || ""} required></CTextarea>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="location">Location</CLabel>
                      <CInput id="location" name="location" placeholder="Lokasi" step="1" onChange={handleChange} value={formData.location || ""} required />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="phone">Phone</CLabel>
                      <CInput id="phone" name="phone" placeholder="Nomor Telephone" onChange={handleChange} value={formData.phone || ""} required />
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
                    {/* <CInputFile name="file" onChange={handleFile} multiple={true} ref={imageRef} /> */}
                    <input type="file" className="form-control" name="file" onChange={handleFile} multiple={true} ref={imageRef} />
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButtonGroup>
                <CButton type="submit" color="primary">Save</CButton>
                <CButton type="button" color="warning" className="text-white" onClick={()=>{reset()}}>Reset</CButton>
                <CButton 
                  color="secondary" 
                  onClick={() => {setModalAdd(false)}}
                >Cancel</CButton>
              </CButtonGroup>
            </CModalFooter>
          </CForm>
        </CModal>

        {/* modal create ticket */}
        <CModal 
          show={modalCreateTicket} 
          onClose={setModalCreateTicket}
          
        >
          <CForm onSubmit={handleInputTicket} method="post">
            <CModalHeader>
              <CModalTitle>Create Ticket</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol sx="12">
                  <CFormGroup>
                    <CLabel htmlFor="team">Teams</CLabel>
                    <CSelect name="team" id="team" onChange={handleChange} required>
                        <option value="" key="0">Please choose team</option>
                      {
                        teams.map((value, index) => {
                          return <option value={ value.id } key={index}>{ value.name }</option>
                        })
                      }
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="12">
                  <CFormGroup>
                    <CLabel htmlFor="stage">Category</CLabel>
                    <CSelect name="category" id="category" onChange={handlCreateTicket} required>
                        <option value="" key="0">Please choose category</option>
                      {
                        categories.map((value, index) => {
                          return <option value={ value.id } key={index}>{ value.name }</option>
                        })
                      }
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="12">
                  <CFormGroup>
                    <CLabel htmlFor="stage">Time</CLabel>
                    <CInput name="timeInterval" value={timeInterval} readOnly={true} /> 
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButton type="submit" color="primary">Save</CButton>
              <CButton 
                color="secondary" 
                onClick={() => {setModalCreateTicket(false)}}
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
                          <CTextarea name="eincident" id="eincident" rows="5" onChange={handleChange} value={formData.eincident || ""} required></CTextarea>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol sx="6">
                        <CFormGroup>
                            <CLabel htmlFor="location">Location</CLabel>
                            <CInput id="elocation" name="elocation" placeholder="Lokasi" step="1" onChange={handleChange} value={formData.elocation || ''} required />
                        </CFormGroup>
                      </CCol>
                      <CCol sx="6">
                        <CFormGroup>
                            <CLabel htmlFor="ephone">Phone</CLabel>
                            <CInput name="ephone" id="ephone" placeholder="Nomor Telephone" onChange={handleChange} defaultValue={formData.ephone || ''} required />
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol sx="6">
                        <CFormGroup>
                          <CLabel htmlFor="efile">File</CLabel>
                          <CInputFile name="file" onChange={handleFile} multiple={true} />
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
              <CButtonGroup>
                <CButton onClick={() => {createIncident()}} color="primary">
                  New Incident
                  <CIcon className="ml-2 mb-2" name="cil-plus"></CIcon>
                </CButton>
                <CButton onClick={() => {resfresh()}} color="info">
                  Refresh 
                  <CIcon className="ml-2 mb-2" name="cil-reload"></CIcon>
                </CButton>
              </CButtonGroup>
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
              tableFilterValue={incidentSearch}
              sorter
              itemsPerPageSelect
              scopedSlots = {{
                'stage':
                (item)=>(
                  <td>
                    <Stage stage={item.stageIncidents.text}/>
                  </td>
                ),
                'category':
                (item)=>(
                  <td>
                    <Category category={(item.categoryIncidents === null) ? "" : item.categoryIncidents.name}/>
                  </td>
                ),
                'team':
                (item)=>(
                  <td>{(item.teamIncidents === null) ? "" : item.teamIncidents.name}</td>
                ),
                'user':
                (item)=>(
                  <td>{item.userIncidents.name}</td>
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
                      <CTooltip content="Edit" placement="top-end">
                        <CButton className="text-white" size="sm" onClick={() => {editIncident(item)}} color={getBadge('Pending')}>
                          <CIcon name="cil-pencil"/>
                        </CButton>
                      </CTooltip>
                      <ButtonDelete item={item} role={role} stage={item.stageIncidents.text} />
                      <CTooltip content="Detail" placement="top-end">
                        <CButton size="sm" onClick={() => {detailIncident(item)}} color={getBadge('Inactive')}>
                          <CIcon name="cil-description"/>
                        </CButton>
                      </CTooltip>
                      <ButtonCreateTicket item={item} role={role} stage={item.stageIncidents.text} />
                      <ButtonResolve item={item} role={role} stage={item.stageIncidents.text} />
                      <ButtonClose  item={item} role={role} stage={item.stageIncidents.text} />
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
