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

const fields = ['role','createdAt','updatedAt','actions']

const Roles = () => {

  let history = useHistory();
  const [status, setStatus] = useState('')
  const [roles, setRoles] = useState([])
  const [team, setTeam] = useState('')
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const [ename, setEname] = useState('')
  const [iname, setIname] = useState('')
  const [eid, setEid] = useState('')
  const [successVisible, setSuccessVisible] = useState(0)
  const [errorVisible, setErrorVisible] = useState(0)
  const [errorStore, setErrorStore] = useState(0)
  const [successStore, setSuccessStore] = useState(0)
  const [errorDelete,setErrorDelete] = useState(0)
  const [successDelete, setSuccessDelete] = useState(0)
  const url = useSelector(state => state.baseUrl)
  const dispatch = useDispatch()

  let getRole = () => {
    axios.get(`${url}/api/role/`,{
      headers:{
        token:localStorage.getItem('shitToken')
      }
    })
    .then(function(response){
      setStatus(response.data.message)
      setRoles(response.data.data)
    })
    .catch(function(error){
      history.push('/login')
    })
  }

  let editRole = (id) => {
    axios.get(`${url}/api/role/${id}`,{
      headers:{
        token:localStorage.getItem('shitToken')
      }
    })
    .then(function(res){
      setEid(res.data.data.id)
      setEname(res.data.data.role)
    })
    .catch(function(error){
      history.push('/login');
    })

    setModal(!modal)
  }

  let updateRole = (id) => {
    axios.put(`${url}/api/role/${id}/update`,{
      'role':ename,
    },{
      headers:{
        token:localStorage.getItem('shitToken')
      }
    })
    .then(function(res){
      setSuccessVisible(10)
      getRole()
      setModal(false)
    })
    .catch(function(error){
      setErrorVisible(10)
      setModal(false)
    });
  }

  let storeRole = (id) => {
    axios.post(`${url}/api/role/store`,{
      'role':iname
    },{
      headers:{
        token:localStorage.getItem('shitToken')
      }
    })
    .then(function(res){
      setSuccessStore(10)
      getRole()
      setModalAdd(false)
    })
    .catch(function(error){
      setErrorStore(10)
      setModalAdd(false)
    })
  }

  let deleteRole = (id) => {
    axios.delete(`${url}/api/role/${id}/delete`,{
      headers:{
        token:localStorage.getItem('shitToken')
      }
    })
    .then(function(){
      setSuccessDelete(10)
      getRole()
    })
    .catch(function(){
      setErrorStore(10)
    })
  }

  let addRole = () => {
    setIname('')
    setModalAdd(!modal)
  }

  useEffect(() => {
    getRole()
  }, [])


  return (
    <>
      <CRow>
        <CModal
          show={modal}
          onClose={setModal}
        >
          <CModalHeader closeButton>
            <CModalTitle>Edit Role</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="name">Name</CLabel>
                  <CInput value={ename} onChange={event => setEname(event.target.value)} id="name" placeholder="Enter your name" required />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={() => {updateRole(eid)}} color="primary">Update</CButton>
            <CButton
              color="secondary"
              onClick={() => {setModal(false)}}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        {/* add modal */}
        <CModal
          show={modalAdd}
          onClose={setModalAdd}
        >
          <CModalHeader closeButton>
            <CModalTitle>Add Role</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="name">Name</CLabel>
                  <CInput onChange={event => setIname(event.target.value)} id="role" placeholder="Enter your name" value={iname} required />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton onClick={() => {storeRole()}} color="primary">Save</CButton>
            <CButton
              color="secondary"
              onClick={() => {setModalAdd(false)}}
            >Cancel</CButton>
          </CModalFooter>
        </CModal>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButton onClick={() => {addRole()}} size="sm" color="primary">
                Add Role
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
                color="danger"
                value={Number(successDelete) * 10}
                size="xs"
                className="mb-3"
              />
            </CAlert>
            <CDataTable
              items={roles}
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
                      <CButton size="sm"  onClick={() => {editRole(item.id)}} color={getBadge('Pending')} className="mr-1">
                        Edit
                      </CButton>
                      <CButton size="sm"  onClick={() => {deleteRole(item.id)}} color={getBadge('Banned')} className="mr-1">
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

export default Roles
