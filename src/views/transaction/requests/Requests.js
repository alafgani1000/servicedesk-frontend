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
  CCardSubtitle,
  CHeader,
  CImg,
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

const fields = ['title','business_need','business_value', 'stage', 'phone','location', 'startDate','endDate','createdAt', 'actions']

const Requests = () => {
    const [formData,setFormData] =  useReducer(formReducer, {})
    const [submitting,setSubmitting] = useState(false)
    const [fileData,setFileData] = useState("")
    const imageRef = useRef()
    const [modalCreate,setModalCreate] = useState(false)
    const [modalDetail,setModalDetail] = useState(false)
    const [modalEdit,setModalEdit] = useState(false)
    const [modalDelete,setModalDelete] = useState(false)
    const [modalOpen,setModalOpen] = useState(false)
    const [modalResolve,setModalResolve] = useState(false)
    const [modalArchive,setModalArchive] = useState(false)
    const [modalClose,setModalClose] = useState(false)
    const [idAttachment,setIdAttachment] = useState(false)
    const [status,setStatus] = useState(null)
    const [requests,setRequests] = useState([])
    const [request,setRequest] = useState()
    const [developers,setDevelopers] = useState([])
    const [devSelect,setDevSelect] = useState([])
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
            'token': localStorage.getItem('shitToken'),
            'Content-Type': 'application/json'
        },
        baseURL:url
    });

    /**
     * get data incidents
     */
    const getRequests = () => {
        Axs.get('api/request',{
        
        })
        .then(function(response){
        // handle success
        setStatus(response.data.status)
        setRequests(response.data.data)
        })
        .catch(function(error){
        history.push('/login')
        })
    }

    /**
     * show modal create
     */
    const showModalCreate = () => {
        setModalCreate(true)
    }

    /**
     * handle for change form value
     * @param {*} event 
     */
    const handleChange = event => {
        const isCheckbox = event.target.type === 'checkbox';
        setFormData({
            name: event.target.name,
            value: isCheckbox ? event.target.checked : event.target.value,
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
    * mengambil value attachment
    * @param {*} event 
    */
    const handleFile = event => {
        setFileData(event.target.files)
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    /**
     * handle create request
     * @param {*} event 
     */
    const handleSubmit = event => {
        event.preventDefault()
        setSubmitting(true)
        const dataArray = new FormData()
        dataArray.append("title", formData.title)
        dataArray.append("business_need", formData.business_need)
        dataArray.append("business_value", formData.business_value)
        dataArray.append("location", formData.location)
        dataArray.append("phone", formData.phone)
        // loop attachment
        for(var i = 0; i < fileData.length; i++){
            dataArray.append("file",fileData[i]) 
        }
        // send data
        Axs.post('/api/request/create', dataArray)
        .then(function(response){
            const socket = io(url);
            socket.emit('newRequest', response.data.data)
            setModalCreate(false)
            getRequests()
            // add toast
            Toast.fire({
                icon: 'success',
                title: 'Request Successfully'
            })
            // reset data form
            setupData("title","")
            setupData("business_need","")
            setupData("business_value","")
            setupData("location","")
            setupData("phone")
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
    const handleUpdate = async event => {
        try{
            event.preventDefault()
            setSubmitting(true)
            const attachmentArray = new FormData()
            attachmentArray.append("id",request.id)
            // update incident   
            if(fileData !== ""){
                const updateRequest = await Asios.patch(`/api/request/${request.id}/update`, {
                    "title":formData.etitle,
                    "business_need":formData.ebusiness_need,
                    "business_value":formData.ebusiness_value,
                    "phone":formData.ephone,
                    "location":formData.elocation
                })
            
                for(var u = 0; u < fileData.length; u++){
                    attachmentArray.append("file",fileData[u])
                }
                const updateAttach = await Axs.post(`/api/request/attachment`, attachmentArray);
                if(updateRequest.data.status === "success"){
                    setModalEdit(false)
                    getRequests()
                    Toast.fire({
                        icon:'success',
                        title:'Update Successfully'
                    })
                }else if(updateRequest.data.status === "error"){
                    Toast.fire({
                        icon:'success',
                        title:'Update Successfully'
                    })
                }
            }else{
                const updateRequest = await Asios.patch(`/api/request/${request.id}/update`, {
                    "title":formData.etitle,
                    "ebusiness_need":formData.ebusiness_need,
                    "ebusiness_value":formData.ebusiness_value,
                    "location":formData.elocation,
                    "phone":formData.ephone
                })
                // cek
                if(updateRequest.data.status === "success"){
                    setModalEdit(false)
                    getRequests()
                    Toast.fire({
                        icon:'success',
                        title:'Update Successfully'
                    })
                }else if(updateRequest.data.status === "eror"){
                    Toast.fire({
                        icon:'error',
                        title:'Update Fail'
                    })
                }
            }

            setTimeout(() => {
                setSubmitting(false)
            }, 3000)
        }catch(err){
            Toast.fire({
                icon:'error',
                title:'Update Fail'
            })
        }
    
    }

    /**
     * approved request
     * @param {*} event 
     */
    const handleOpen = async event => {
        try {
            event.preventDefault()
            const sDate = moment(formData.startDate).format("YYYY-MM-DD")
            const sTime = moment(formData.startDate).format("HH:mm:ss")
            const eDate = moment(formData.endDate).format("YYYY-MM-DD")
            const eTime = moment(formData.endDate).format("HH:mm:ss")
            if (devSelect.length > 0) {
                // update
                const update = await Asios.patch(`api/request/${request.id}/open`,{
                    start_date:sDate,
                    start_time:sTime,
                    end_date:eDate,
                    end_time:eTime,
                    developers:devSelect
                });
                // check status update data
                if(update.data.status === "success"){
                    setModalOpen(false)
                    getRequests()
                    // show toast
                    Toast.fire({
                        icon:"success",
                        title:"Request Approved"
                    })
                    // send socket data to server
                    const socket = io(url)
                    socket.emit("openRequest",update.data.notifId)
                    // show ticket
                    Swal.fire({
                        title:'Request Approved',
                        width: 600,
                        padding: '3m',
                        html:'<b>NOMOR TICKET : '+update.data.ticket+'</b><br><b>Dari <span class="badge bg-warning text-white">'+update.data.data.start_date+' </span> Sampai <span class="badge bg-warning text-white">'+update.data.data.end_date+ '</span></b> '
                    })
                }else if(update.data.status === "error"){
                    setModalOpen(false)
                    Toast.fire({
                        icon:"error",
                        title:"Process Fail"
                    })
                }
            } else {
                Swal.fire({
                    title:'Please chose developer'
                })
            }
        } catch(error) {
            Toast.fire({
                icon:"error",
                title:"Process Fail"
            })
        }
    }

    const showOpenRequest = (item) => {
        setRequest(item)
        setModalOpen(true)
        setDevSelect([])
    }

    /**
     * show detail data request
     */
    const showDetail = (item) => {
        setRequest(item)
        setModalDetail(true)
    }

    /**
     * data attachment for edit lampiran data attachment
     * @returns 
     */
    const EditDataAttachments = () => {
        if(request !== undefined){
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
                            request.requestAttachments.map((value, index) => {
                            var link = `${url}/static/file/${value.file_name}`;
                            return (
                                <tr key={index}>
                                <td><CLink href={link} target="_blank">{value.alias}</CLink></td>
                                <td>
                                    <CTooltip content="Delete" placement="top-end">
                                        <CButton color="danger" onClick={() => {deleteAttachConfirm(value.id)}}>
                                            Delete
                                            <CIcon className="mb-1 ml-2" name="cil-trash"></CIcon>
                                        </CButton>
                                    </CTooltip>
                                </td>
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
     * request attachment component for detail
     * @returns 
     */
    const AttachmentRequest = () => {
        if(request !== undefined){
            return(
                <CCard>
                    <CCardHeader>
                        <CCardSubtitle>Attachment</CCardSubtitle>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    {
                                        request.requestAttachments.map((value, index) => {
                                            var link = `${url}/static/file/${value.file_name}`
                                            return(
                                                <CCardText key={index}>
                                                    <CLink key={index} href={link} target="_blank">{value.alias}</CLink>
                                                    <CIcon className="ml-2" name="cil-zoom" onClick={() => {showImage(link)}}></CIcon>
                                                </CCardText>
                                            )
                                        })
                                    }
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )
        }else{
            return(
                <CRow>
                    Data Not Found
                </CRow>
            )
        }
    }

    const RequestDevelopers = () => {
        if (request !== undefined) {
            return(
                <CCard>
                    <CCardHeader>
                        <CCardSubtitle>Developers</CCardSubtitle>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol>
                                <table>
                                    <tbody>
                                        {
                                            request.requestDevelopers.map((item,index) => {
                                                return( 
                                                    <tr key={index}>
                                                        <td>
                                                            <div className="c-avatar" style={{marginBottom:15}}>
                                                               <div style={{borderRadius:'50%', backgroundColor:'silver', paddingLeft:10, paddingRight:10}}>
                                                                    <span style={{fontSize:28, fontWeight:'bold'}}>{item.userDev.name.charAt(0).toUpperCase()}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{verticalAlign:'top'}}>
                                                            <span style={{fontSize:20, fontWeight:"bold", marginLeft:10 }}>{ item.userDev.name.charAt(0).toUpperCase() + item.userDev.name.slice(1) }</span>
                                                        </td>
                                                    </tr>)
                                                })
                                        }
                                    </tbody>
                                </table>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )
        } else {
            return (
                <CRow>
                    Data Not Found
                </CRow>
            )
        }
    }

    /**
     * detail request component
     * @returns 
     */
    const DetailRequest = () => {
        {/* modal detail */}
        if(request !== undefined){
            let color = ''
            if(request.stagesRequests.text === 'New'){
                color = 'info'
            }else if(request.stagesRequests.text === 'Open'){
                color = 'warning'
            }else if(request.stagesRequests.text === 'Resolve'){
                color = 'primary'
            }else if(request.stagesRequests.text === 'Close'){
                color = 'success'
            }else if(request.stagesRequests.text === 'Archive'){
                color = 'secondary'
            }
            return(    
                <CCard>
                    <CCardHeader>
                        <CCardSubtitle>
                            Request
                        </CCardSubtitle>
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Title:</CLabel>
                                    <CCardText>{request.title || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Business Need:</CLabel>
                                    <CCardText>{request.business_need || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Business Value:</CLabel>
                                    <CCardText>{request.business_value || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Stage:</CLabel>
                                    <CCardText><CBadge color={color} style={{fontSize:"12px"}}>{request.stagesRequests.text}</CBadge></CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Nomor Ticket:</CLabel>
                                    <CCardText><CBadge color={color} style={{fontSize:"12px"}}>{request.ticket}</CBadge></CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Start Date:</CLabel>
                                    <CCardText><CBadge color={color} style={{fontSize:"12px"}}>{moment(request.start_date).format("DD MMMM YY")}</CBadge></CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">End Date:</CLabel>
                                    <CCardText><CBadge color={color} style={{fontSize:"12px"}}>{moment(request.end_date).format("DD MMMM YY")}</CBadge></CCardText>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Location:</CLabel>
                                    <CCardText>{request.location || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">User Created:</CLabel>
                                    <CCardText>{request.userRequests.name.charAt(0).toUpperCase() + request.userRequests.name.slice(1)}</CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Phone:</CLabel>
                                    <CCardText>{request.phone || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                            <CCol>
                                <CFormGroup>
                                    <CLabel className="font-weight-bold">Phone:</CLabel>
                                    <CCardText>{ moment(request.cratedAt).format("DD-MM-YY h:m:s") || ""}</CCardText>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            )
        }else{
            return(
                <CRow>
                    Data Not Found
                </CRow>
            )
        }
    }

    /**
     * form dialog delete attachment
     * @param {*} data 
     */
    const deleteAttachConfirm = (data) => {
        setIdAttachment(data)
        setModalDelete(true)
    }

    /**
     * delete attachment
     * @param {*} data 
     */
    const deleteAttachment = (data) => {
        Axs.delete(`api/request/${data}/delete`,{})
        .then((response) => {
            Toast.fire({
                icon:'success',
                title:'Delete Duccessfulley'
            })
            setModalDelete(false)
        })
        .catch((error) => {
            Toast.fire({
                icon:'error',
                title:'Delete fail'
            })
            setModalDelete(false)
        })
    }  

    /**
     * show modal edit incident and setup variabel for formData state
     * @param {*} incidentData 
     */
    const editRequest = (requestData) => {
        setRequest(requestData)
        setModalEdit(true)
        setupData("etitle",requestData.title)
        setupData("ebusiness_need",requestData.business_need)
        setupData("ebusiness_value",requestData.business_value)
        setupData("elocation",requestData.location)
        setupData("ephone",requestData.phone)
    }

    /**
     * show form confirmation resolve
     * @param {*} item 
     */
    const confirmResolve = (item) => {
        setRequest(item)
        setModalResolve(true)
    }

    /**
     * process resolve
     * @param {*} data 
     */
    const requestResolve = async (data) => {
        try {
            const resolve = await Asios.patch(`api/request/${data.id}/resolve`, {})
            if (resolve.data.status === "success") {
                // show toast
                Toast.fire({
                    icon:"success",
                    title:"Resolve Successfully"
                })
                // send web socket data for notification
                const socket = io(url)
                socket.emit("resolveRequest", resolve.data.notifId)
                // close modal
                setModalResolve(false)
            } else if (resolve.data.status === "error"){
                Toast.fire({
                    icon:"error",
                    title:"Resolve Fail"
                })
            }   
        } catch (error) {
            Toast.fire({
                icon:"error",
                title:"Resolve Fail"
            })
        }
    }

    /**
     * show close confirmation
     * @param {*} item 
     */
    const confirmClose =  (item) => {
        setRequest(item)
        setModalClose(true)
    }

    /**
     * proses close request
     * @param {*} data 
     */
    const requestClose = async (data) => {
        try {
            const close = await Asios.patch(`api/request/${data.id}/close`, {})
            if (close.data.status ==="success") {
                // show toast

                Toast.fire({
                    icon:"success",
                    title:"Close Successfully"
                })

                // send web socket data for notification
                const socket = io(url)
                socket.emit("closeRequest", close.data.notifId)
                
                // close modal
                setModalClose(false)
            } else if (close.data.status === "success") {
                Toast.fire({
                    icon:"error",
                    title:"Close Fail"
                })
            }
        } catch (error) {
            Toast.fire({
                icon:"error",
                title:"Close Fail"
            })
        }
    }
    
    /**
     * menampilkan gambar lampiran
     * @param {*} item 
     */
    const showImage = (item) => {
        Swal.fire({
            imageUrl: item,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            imageAlt: 'Custom image',
        })
    }

    /**
     * check array
     * @param {*} dataArray 
     * @param {*} dataValue 
     */
    const checkSelDeveloper = (dataArray, dataValue) => {
        for(var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].value === dataValue) {
                return dataValue;
            }
        }
    }

    /**
     * handle chose developers
     * @param {*} event 
     */
    const handleSelDeveloper = event => {
        const target = event.target
        const name = target.name
        const value = target.value
        const text = event.target.options[event.target.selectedIndex].text
        if(value !== 0) {
            if (devSelect.length === 0) {
                setDevSelect(prevState => {
                    return [ ...prevState, {"name":text, "value":value}]
                })
            } else {
                const checked = checkSelDeveloper(devSelect, value);
                if (checked !== value) {
                    setDevSelect(prevState => {
                        return [ ...prevState, {"name":text, "value":value}]
                    })
                }
            }
        }
    }

    /**
     * remove developers
     * @param {*} id 
     */
    const removeSelDeveloper = (id) => {
        let dataSelect = devSelect
        let filteredData = dataSelect.filter(value => value.value !== id)
        setDevSelect(filteredData)
    }

    useEffect(() => { 
        // setStateIncidentSearch(incidentSearch)
        const getRequest = () => {
            Axs.get('api/request',{})
            .then((response) => {
                setRequests(response.data.data)
            })
            .catch((error) => {
                history.push('/login')
            })
        }
        const getDevelopers = () => {
            Axs.get('api/user/data/developers',{})
            .then((response) => {
                setDevelopers(response.data.data)
            })
            .catch((error) => {
                history.push('/login')
            })
        }
        getRequest()
        getDevelopers()
    },[])

    /**
     * component button open
     * @param {*} props 
     * @returns 
     */
    const ButtonOpen = (props) => {
        if (props.role === "admin") {
            if (props.stage === "New") {
                return (
                    <CTooltip content="Open" placement="top-end">
                        <CButton size="sm" color="primary" onClick={() => {showOpenRequest(props.item)}}>
                            <CIcon name="cil-av-timer"></CIcon>
                        </CButton>
                    </CTooltip>
                )
            } else {
                return ""
            }
        } else {
            return ""
        }
    }

    /**
     * component button resolve
     * @param {*} props 
     * @returns 
     */
    const ButtonResolve = (props) => {
        if (props.role === "admin") {
            if (props.stage === "Open") {
                return (
                    <CTooltip content="Resolve" placement="top-end">
                        <CButton size="sm" color="success" onClick={() => {confirmResolve(props.item)}}>
                            <CIcon name="cil-check-circle"></CIcon>
                        </CButton>
                    </CTooltip>
                )
            } else {
                return ""
            }
        } else {
            return ""
        }
    }

    /**
     * component button close
     * @param {*} props 
     * @returns 
     */
    const ButtonClose = (props) => {
        if (props.role === "admin") {
            if(props.stage === "Resolve") {
                return (
                    <CTooltip content="Close" placement="top-end">
                        <CButton size="sm" color="info" onClick={() => {confirmClose(props.item)}}>
                            <CIcon name="cil-book"></CIcon>
                        </CButton>
                    </CTooltip>
                )
            } else {
                return ""
            }
        } else {
            return ""
        }
    }

    /**
     * component stage
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
    
    
    return (
        <>
        {/* modal create */}
        <CModal
        show={modalCreate}
        onClose={setModalCreate}
        size="xl"
        >
            <CModalHeader>
                <CModalTitle>Create Request</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleSubmit} method="post">
            <CModalBody>
                <CRow>
                    <CCol xs="12">
                    <CFormGroup>
                        <CLabel htmlFor="incident">Title</CLabel>
                        <CTextarea name="title" id="title" rows="5" onChange={handleChange} value={formData.title || ""} required></CTextarea>
                    </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12">
                    <CFormGroup>
                        <CLabel htmlFor="business_need">Business Need</CLabel>
                        <CTextarea name="business_need" id="business_need" rows="5" onChange={handleChange} value={formData.business_need || ""} required></CTextarea>
                    </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs="12">
                    <CFormGroup>
                        <CLabel htmlFor="business_value">Business Value</CLabel>
                        <CTextarea name="business_value" id="business_value" rows="5" onChange={handleChange} value={formData.business_value || ""} required></CTextarea>
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
                        <CInput name="phone" id="phone" placeholder="Nomor Telephone" onChange={handleChange} value={ formData.phone || ""} required />
                    </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sx="6">
                    <CFormGroup>
                        <CLabel htmlFor="file">File</CLabel>
                        <input type="file" name="file" className="form-control" onChange={handleFile} ref={imageRef}  multiple={true} />
                    </CFormGroup>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButtonGroup>
                    <CButton
                        color="primary"
                        type="submit"
                    >Save
                    <CIcon name="cil-save" className="ml-2 mb-1"></CIcon>
                    </CButton>
                    <CButton 
                        type="button"
                        color="danger" 
                        onClick={() => {setModalCreate(false)}}
                        >Cancel
                        <CIcon name="cil-x" className="ml-2 mb-1"></CIcon>
                    </CButton>
                </CButtonGroup>
            </CModalFooter>
        </CForm>
        </CModal>
        {/* modal detail */}
        <CModal
        show={modalDetail}
        onClose={setModalDetail}
        size="xl"
        >
            <CModalHeader>
                <CModalTitle>Detail Request</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <DetailRequest/>
                <RequestDevelopers/>
                <AttachmentRequest/>
            </CModalBody>
            <CModalFooter>
                <CButtonGroup>
                    <CButton 
                        type="button"
                        color="secondary" 
                        onClick={() => {setModalDetail(false)}}
                        >Cancel
                        <CIcon name="cil-x" className="ml-2 mb-1"></CIcon>
                    </CButton>
                </CButtonGroup>
            </CModalFooter>
        </CModal>
        {/* modal edit */}
        <CModal
            show={modalEdit}
            onClose={setModalEdit}
            size="xl"
          >
            <CModalHeader>
                <CModalTitle>Edit Request</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleUpdate} method="post">
                <CModalBody>
                    <CCard>
                        <CCardHeader>
                            Update Incident
                        </CCardHeader>
                        <CCardBody>
                            <CRow>
                                <CCol xs="12">
                                    <CFormGroup>
                                        <CLabel htmlFor="etitle">Title:</CLabel>
                                        <CTextarea name="etitle" id="etitle" rows="5" onChange={handleChange} value={formData.etitle || ""} required></CTextarea>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12">
                                    <CFormGroup>
                                        <CLabel htmlFor="ebusiness_need">Business Need:</CLabel>
                                        <CTextarea name="ebusiness_need" id="ebusiness_need" rows="5" onChange={handleChange} value={formData.ebusiness_need || ""} required></CTextarea>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="12">
                                    <CFormGroup>
                                        <CLabel htmlFor="ebusiness_value">Business Need:</CLabel>
                                        <CTextarea name="ebusiness_value" id="ebusiness_value" rows="5" onChange={handleChange} value={formData.ebusiness_value || ""} required></CTextarea>
                                    </CFormGroup>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol xs="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="elocation">Location:</CLabel>
                                        <CInput name="elocation" onChange={handleChange} value={formData.elocation || ""} />
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="6">
                                    <CFormGroup>
                                        <CLabel htmlFor="ephone">Phone:</CLabel>
                                        <CInput name="ephone" onChange={handleChange} value={formData.ephone || ""} />
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
                        </CCardBody>
                    </CCard>
                    <EditDataAttachments/>
                </CModalBody>
                <CModalFooter>
                    <CButtonGroup>
                        <CButton type="submit" color="primary">Update<CIcon className="mb-1 ml-2" name="cil-save"></CIcon></CButton>
                        <CButton type="button" color="danger" onClick={() => {setModalEdit(false)}}>Cancel<CIcon className="mb-1 ml-2" name="cil-x"></CIcon></CButton>
                    </CButtonGroup>
                </CModalFooter>
            </CForm>
        </CModal>
        {/* modal delete attachment */}
        <CModal
            show={modalDelete}
            onClose={setModalDelete}
            size="sm"
        >
            <CModalBody className="bg-secondary">
               <h5>Delete file ?</h5>
            </CModalBody>
            <CModalFooter>
                <CButtonGroup>
                    <CButton
                    type="button"
                    color="danger"
                    onClick={() => {deleteAttachment(idAttachment)}}
                    >Delete
                    <CIcon className="mb-1 ml-2" name="cil-trash"></CIcon>
                    </CButton>
                    <CButton 
                        type="button"
                        color="secondary" 
                        onClick={() => {setModalDelete(false)}}
                        >Cancel
                        <CIcon name="cil-x" className="ml-2 mb-1"></CIcon>
                    </CButton>
                </CButtonGroup>
            </CModalFooter>
        </CModal>
        {/* modal open request */}
        <CModal
            show={modalOpen}
            onClose={setModalOpen}
        >
            <CModalHeader>
                <CModalTitle>Open Request</CModalTitle>
            </CModalHeader>
            <CForm onSubmit={handleOpen}>
                <CModalBody>
                    <CRow>
                        <CCol>
                            <CFormGroup>
                                <CLabel>Start Date:</CLabel>
                                <CInput type="datetime-local" name="startDate" onChange={handleChange} required></CInput>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol>
                            <CFormGroup>
                                <CLabel>End Date:</CLabel>
                                <CInput type="datetime-local" name="endDate" onChange={handleChange} required></CInput>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol>
                            <CFormGroup>
                                <CLabel>Developer</CLabel>
                                <select name="developer" className="form-control" onChange={handleSelDeveloper}>
                                        <option value="0">Chose...</option>
                                    {
                                        developers.map((value,index) => {
                                            return <option valuetext={value.name} key={index} value={value.id}>{value.name}</option>
                                        })
                                    }
                                </select>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol>
                            <CFormGroup>
                                <CLabel>Developer choosed:</CLabel>
                                <table className="table">
                                    <tbody>
                                        {
                                            devSelect.map((value,index) => {
                                                return( 
                                                    <tr key={index}>
                                                        <td><CIcon name="cil-check-alt"></CIcon></td>
                                                        <td>{value.name}</td>
                                                        <td>
                                                            <CTooltip content="remove" placement="top-end">
                                                                <CButton className="btn btn-sm btn-danger" onClick={() => {removeSelDeveloper(value.value)}}><CIcon name="cil-x"></CIcon></CButton>
                                                            </CTooltip>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CModalBody>
                <CModalFooter>
                    <CButtonGroup>
                        <CButton color="primary" type="submit">
                            Save <CIcon name="cil-save" className="mb-1 ml-2"></CIcon>
                        </CButton>
                        <CButton color="danger" type="button" onClick={() => {setModalOpen(false)}}>
                            Cancel <CIcon name="cil-x" className="mb-1 ml-2"></CIcon>
                        </CButton>
                    </CButtonGroup>
                </CModalFooter>
            </CForm>
        </CModal>
        {/* modal resolve request */}
        <CModal
            show={modalResolve}
            onClose={setModalResolve}
            size="sm"
        >
            <CModalHeader>
                <CModalTitle>Confirm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <h5>Resolve Request ?</h5>
            </CModalBody>
            <CModalFooter>
                <CButtonGroup>
                    <CButton type="button" color="success" onClick={() => {requestResolve(request)}}>
                        Resolve <CIcon className="mb-1 ml-2" name="cil-check-circle"></CIcon>
                    </CButton>
                    <CButton type="button" color="secondary" onClick={() => {setModalResolve(false)}}>
                        Cancel <CIcon className="mb-1 ml-2" name="cil-x"></CIcon>
                    </CButton>
                </CButtonGroup>
            </CModalFooter>
        </CModal>
        {/* moda close request */}
        <CModal
            show={modalClose}
            onClose={setModalClose}
            size="sm"
        >
            <CModalHeader>
                <CModalTitle>Confirm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <h5>Close Request ?</h5>
            </CModalBody>
            <CModalFooter>
                <CButtonGroup>
                    <CButton type="button" color="info" onClick={() => {requestClose(request)}}>
                        Close <CIcon className="mb-1 ml-2" name="cil-book"></CIcon>
                    </CButton>
                    <CButton type="button" color="secondary" onClick={() => {setModalClose(false)}}>
                        Cancel <CIcon className="mb-1 ml-2" name="cil-x"></CIcon>
                    </CButton>
                </CButtonGroup>
            </CModalFooter>
        </CModal>
        <CRow>
            {/* data table */}
            <CCol xs="12" lg="12">
            <CCard>
                <CCardHeader>
                <CButtonGroup>
                    <CButton color="primary" onClick={() => {showModalCreate()}}>
                    New Request
                    <CIcon className="ml-2 mb-2" name="cil-plus"></CIcon>
                    </CButton>
                    <CButton color="info">
                    Refresh 
                    <CIcon className="ml-2 mb-2" name="cil-reload"></CIcon>
                    </CButton>
                </CButtonGroup>
                </CCardHeader>
            </CCard>
            <CCard>
                <CCardHeader>
                    Requests
                    <DocsLink name="CModal"/>
                </CCardHeader>
                <CCardBody>
                <CDataTable
                items={requests}
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
                        <td><Stage stage={item.stagesRequests.text} /></td>
                    ),
                    'createdAt':
                    (item)=>(
                        <td>{moment(item.createdAt).format("DD-MM-YYYY H:m:s")}</td>
                    ),
                    'startDate':
                    (item)=>(
                        <td>{moment(item.start_date).format("DD-MM-YYYY H:m:s")}</td>
                    ),
                    'endDate':
                    (item)=>(
                        <td>{moment(item.end_date).format("DD-MM-YYYY H:m:s")}</td>
                    ),
                    'actions':
                    (item)=>(
                    <td>
                        <CButtonGroup>
                            <CTooltip content="Edit" placement="top-end">
                                <CButton className="text-white" size="sm" color="warning" onClick={() => {editRequest(item)}}>
                                    <CIcon name="cil-pencil"></CIcon>
                                </CButton>
                            </CTooltip>
                            <CTooltip content="Detail" placement="top-end">
                                <CButton size="sm" color="secondary" onClick={() => {showDetail(item)}}>
                                    <CIcon name="cil-description"></CIcon>
                                </CButton>
                            </CTooltip>
                            <ButtonOpen stage={item.stagesRequests.text} role={role} item={item} />
                            <ButtonResolve stage={item.stagesRequests.text} role={role} item={item} />
                            <ButtonClose stage={item.stagesRequests.text} role={role} item={item} />
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

export default Requests
