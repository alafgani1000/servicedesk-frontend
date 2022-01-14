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

const fields = ['nopegawai','kodeBarang','namaBarang', 'Pinjam', 'Kembali', 'createdAt', 'updatedAt', 'actions']

const Loangoods = () => {
  const [formData, setFormData] =  useReducer(formReducer, {})
  const [submitting, setSubmitting] = useState(false)
  const [fileData, setFileData] = useState("")
  const imageRef = useRef()

  const [status, setStatus] = useState(null)
  const [peminjamans, setPeminjamans] = useState([])
  const [peminjaman, setPeminjaman] = useState();
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
   * get data loan goods
   */
  const getPeminjamans = () => {
    Axs.get('api/peminjaman/data',{

    })
    .then(function(response){
      // handle success
      setStatus(response.data.status)
      setPeminjamans(response.data.data)
    })
    .catch(function(error){
      history.push('/login')
    })
  }

  /**
   * get data peminjaman
   */
  const getPeminjaman = () => {
    Axs.get(`api/peminjama/${peminjaman.id}`, {

    })
    .then(function(response){
      setPeminjaman(response.data.data)
    })
    .catch(function(error){
      console.log(error)
    })
  }

  const newPeminjaman = () => {
    setModalAdd(true)
  }

  const handleSubmit = event => {
    event.preventDefault()
    setSubmitting(true);
    const dataArray = new FormData()
    dataArray.append("nopegawai", formData.nopegawai)
    dataArray.append("kodeBarang", formData.kodeBarang)
    dataArray.append("namaBarang", formData.namaBarang)
    Axs.post('/api/peminjman/pinjam',dataArray)
      .then()
  }

  const reset = () => {

  }

   /**
   * menyimpan inputan di formData
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
     * mengambil inputan untuk proses create incident
     */
    const handleChange = event => {
      const isCheckbox = event.target.type === 'checkbox';
      setFormData({
        name: event.target.name,
        value: isCheckbox ? event.target.checked : event.target.value,
      })
    }

  useEffect(() => {
    getPeminjamans();
  },[])

  return (
    <>
      <CRow>
        {/* modal add */}
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
                <CCol sx="12">
                  <CFormGroup>
                      <CLabel htmlFor="nopegawai">Nopegawai</CLabel>
                      <CInput id="nopegawai" name="nopegawai" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="kodeBarang">Kode Barang</CLabel>
                      <CInput id="kodeBarang" name="kodeBarang" onChange={handleChange} required />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                      <CLabel htmlFor="namaBarang">Nama Barang</CLabel>
                      <CInput id="namaBarang" name="namaBarang" onChange={handleChange} required />
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
        {/* data table */}
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButtonGroup>
                <CButton color="primary" onClick={() => {newPeminjaman()}}>
                  New
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
              Loan Goods
              <DocsLink name="CModal"/>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={peminjamans}
              fields={fields}
              itemsPerPage={5}
              pagination
              columnFilter
              tableFilter
              tableFilterValue={incidentSearch}
              sorter
              itemsPerPageSelect
              scopedSlots = {{
                'Pinjam':
                ($item)=>(
                  <td>{ $item.tanggalPinjam }</td>
                ),
                'Kembali':
                ($item)=>(
                  <td>{ $item.tanggalKembali }</td>
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
                      <CTooltip content="Kembali" placement="top-end">
                        <CButton className="text-white" size="sm" color={getBadge('Pending')}>
                          <CIcon name="cil-pencil"/>
                        </CButton>
                      </CTooltip>
                      <CTooltip content="Detail" placement="top-end">
                        <CButton size="sm" color={getBadge('Inactive')}>
                          <CIcon name="cil-description"/>
                        </CButton>
                      </CTooltip>
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

export default Loangoods
