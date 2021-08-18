import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CDataTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CFormGroup,
  CInput,
  CLabel,
  CAlert,
  CProgress,
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

const getBadge = actions => {
  switch (actions) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = ['text','description','createdAt','updatedAt','actions']

const Stages = () => {

  let history = useHistory();
  const [status, setStatus] = useState('')
  const [stages, setStages] = useState([])
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [etext, setEtext] = useState('')
  const [edesc, setEdesc] = useState('')
  const [itext, setItext] = useState('')
  const [idesc, setIdesc] = useState('')
  const [eid, setEid] = useState('')
  const [delid, setDelid] = useState('')
  const [successVisible, setSuccessVisible] = useState(0)
  const [errorVisible, setErrorVisible] = useState(0)
  const [errorStore, setErrorStore] = useState(0)
  const [successStore, setSuccessStore] = useState(0)
  const [errorDelete,setErrorDelete] = useState(0)
  const [successDelete, setSuccessDelete] = useState(0)
  const url = useSelector(state => state.baseUrl)
  const dispatch = useDispatch()

  const Axs = axios.create({
      headers: {
          token: localStorage.getItem('shitToken')
      },
      baseURL: url
  })
  
  const getStage = () => {
    Axs.get(`api/stage/`,{

    })
    .then(function(response){
      setStatus(response.data.message)
      setStages(response.data.data)
    })
    .catch(function(error){
      history.push('/login')
    })
  }

  const editStage = (item) => {
    setEid(item.id)
    setEtext(item.text)
    setEdesc(item.description)
    setModal(!modal)
  }

  const deleteConfirm =  (item) => {
      setDelid(item.id)
      setModalDelete(!modalDelete)
  }

  const updateStage = (id) => {
    Axs.put(`api/stage/${id}/update`,{
      'text': etext,
      'description': edesc
    })
    .then(function(res){
      setSuccessVisible(10)
      getStage()
      setModal(false)
    })
    .catch(function(error){
      setErrorVisible(10)
      setModal(false)
    });
  }

  const storeStage = (id) => {
    Axs.post(`api/stage/store`,{
        'text':itext,
        'description': idesc
    })
    .then(function(res){
      setSuccessStore(10)
      getStage()
      setModalAdd(false)
    })
    .catch(function(error){
      setErrorStore(10)
      setModalAdd(false)
    })
  }

  let deleteStage = (id) => {
    Axs.delete(`api/stage/${id}/delete`,{
     
    })
    .then(function(){
      setSuccessDelete(10)
      getStage()
      setModalDelete(false)
    })
    .catch(function(){
      setErrorStore(10)
      setModalDelete(false)
    })
  }

  useEffect(() => {
    getStage()
  }, [])

 
  return (
    <>
      <CRow>
        <CModal 
          show={modal} 
          onClose={setModal}
        >
          <CModalHeader closeButton>
            <CModalTitle>Edit Stage</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="text">Text</CLabel>
                  <CInput value={etext} onChange={event => setEtext(event.target.value)} id="etext" placeholder="Enter name stage" required />
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="desc">Description</CLabel>
                    <CInput value={edesc} onChange={event => setEdesc(event.target.value)} id="edesc" placeholder="Description" required />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={() => {updateStage(eid)}} color="primary">Update</CButton>
            <CButton 
              color="secondary" 
              onClick={() => {setModal(false)}}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        <CModal 
            show={modalDelete}
            onClose={setModalDelete}
        >
            <CModalHeader closeButton>
                <CModalTitle>Confirm</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol xs="12">
                        <CLabel>Delete data ?</CLabel>
                    </CCol>
                </CRow>
            </CModalBody>
            <CModalFooter>
                <CButton onClick={() => {deleteStage(delid)}} color="primary">Delete</CButton>
                <CButton 
                color="secondary" 
                onClick={() => {setModalDelete(false)}}
                >Cancel</CButton>
            </CModalFooter>
        </CModal>
        {/* add modal */}
        <CModal 
          show={modalAdd} 
          onClose={setModalAdd}
        >
          <CModalHeader closeButton>
            <CModalTitle>Add Stage</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="text">Text</CLabel>
                  <CInput onChange={event => setItext(event.target.value)} id="text" placeholder="Enter name stage" required />
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="text">Description</CLabel>
                    <CInput onChange={event => setIdesc(event.target.value)} id="desc" placeholder="Description" required />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={() => {storeStage()}} color="primary">Save</CButton>
            <CButton 
              color="secondary" 
              onClick={() => {setModalAdd(false)}}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButton onClick={() => {setModalAdd(!modal)}} size="sm" color="primary">
                Add Stage
              </CButton>
            </CCardHeader>
          </CCard>
          <CCard>
            <CCardHeader>
              Roles
              <DocsLink name="CModal"/>
            </CCardHeader>
            <CCardBody>
            <CAlert
              color="success"
              show={successVisible}
              closeButton
              onShowChange={setSuccessVisible}
            >
              Role updated
              <CProgress
                striped
                color="success"
                value={Number(successVisible) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CAlert
              color="danger"
              show={errorVisible}
              closeButton
              onShowChange={setErrorVisible}
            >
              Error, My be something wrong
              <CProgress
                striped
                color="danger"
                value={Number(errorVisible) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CAlert
              color="danger"
              show={errorStore}
              closeButton
              onShowChange={setErrorStore}
            >
              Error, My be something wrong
              <CProgress
                striped
                color="danger"
                value={Number(errorStore) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CAlert
              color="success"
              show={successStore}
              closeButton
              onShowChange={setSuccessStore}
            >
             Data Saved
              <CProgress
                striped
                color="success"
                value={Number(successStore) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CAlert
              color="danger"
              show={errorDelete}
              closeButton
              onShowChange={setErrorDelete}
            >
              Error, My be something wrong
              <CProgress
                striped
                color="danger"
                value={Number(errorDelete) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CAlert
              color="success"
              show={successDelete}
              closeButton
              onShowChange={setSuccessDelete}
            >
              Data Deleted
              <CProgress
                striped
                color="success"
                value={Number(successDelete) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CDataTable
              items={stages}
              fields={fields}
              itemsPerPage={5}
              pagination
              scopedSlots = {{
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
                      <CButton size="sm"  onClick={() => {editStage(item)}} color={getBadge('Pending')} className="mr-1">
                        Edit
                      </CButton>
                      <CButton size="sm"  onClick={() => {deleteConfirm(item)}} color={getBadge('Banned')} className="mr-1">
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

export default Stages
