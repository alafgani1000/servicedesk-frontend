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
  CSelect,
  CForm,
  CButtonGroup,
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import CIcon from '@coreui/icons-react'

const getBadge = actions => {
  switch (actions) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = ['name','username','email','level','groupUser','createdAt','updatedAt','actions']


const Users = () => {

    let history = useHistory();
    const [status, setStatus] = useState('')
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
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
    
    const Axs = axios.create({
        headers: {
            token:localStorage.getItem('shitToken')
        },
        baseURL:url
    })


    const getUsers = () => {
        Axs.get(`api/user/admin/all`,{
           
        })
        .then(function(response){
            setStatus(response.data.message)
            setUsers(response.data.data)
        })
        .catch(function(error){
            history.push('/login')
        })
    }

    const getRoles = () => {
        Axs.get(`api/role`, {
    
        })
        .then(function(response){
            setStatus(response.data.message)
            setRoles(response.data.data)
        })
        .catch(function(){
            history.push('/login')
        })
    }

    let editTeam = (id) => {
        axios.get(`${url}/api/team/${id}`,{
        headers:{
            token:localStorage.getItem('shitToken')
        }
        })
        .then(function(res){
        setEid(res.data.data.id)
        setEname(res.data.data.name)
        })
        .catch(function(error){
        history.push('/login');
        })

        setModal(!modal)
    }

    let updateTeam = (id) => {
        axios.put(`${url}/api/team/${id}/update`,{
        'name':ename,
        },{
        headers:{
            token:localStorage.getItem('shitToken')
        }
        })
        .then(function(res){
        setSuccessVisible(10)
        getUsers()
        setModal(false)
        })
        .catch(function(error){
        setErrorVisible(10)
        setModal(false)
        });
    }

    let storeTeam = (id) => {
        axios.post(`${url}/api/team/store`,{
        name:iname
        },{
        headers:{
            token:localStorage.getItem('shitToken')
        }
        })
        .then(function(res){
        setSuccessStore(10)
            getUsers()
            setModalAdd(false)
        })
        .catch(function(error){
        setErrorStore(10)
        setModalAdd(false)
        })
    }

    let deleteTeam = (id) => {
        axios.delete(`${url}/api/team/${id}/delete`,{
        headers:{
            token:localStorage.getItem('shitToken')
        }
        })
        .then(function(){
        setSuccessDelete(10)
        getUsers()
        })
        .catch(function(){
        setErrorStore(10)
        })
    }

    const Rolelist = (props) => {
        const roles = props.roles;
        const items = roles.map((role)=>{
            <li key={role.id}>
                {role.role}
            </li>
        })
        return (
            <CSelect custom name="select" id="select">
                {items}
            </CSelect>
        )
    }

    useEffect(() => {
        getUsers()
        getRoles()
    }, [])

 
    return (
        <>
        <CRow>
            <CModal 
            show={modal} 
            onClose={setModal}
            size="lg"
            >
            <CModalHeader closeButton>
                <CModalTitle>Edit Team</CModalTitle>
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
                <CButton onClick={() => {updateTeam(eid)}} color="primary">Update</CButton>
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
            size="lg"
            >
            <CModalHeader closeButton>
                <CModalTitle>Add User</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm>
                    <CFormGroup row>
                        <CCol md="6">
                            <CLabel htmlFor="name">Name</CLabel>
                            <CInput type="text" id="inputName" />
                        </CCol>
                        <CCol md="6">
                            <CLabel htmlFor="userName">Username</CLabel>
                            <CInput type="text" id="inputUserName" />
                        </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                        <CCol md="6">
                            <CLabel htmlFor="email">Email</CLabel>
                            <CInput type="email" id="inputEmail" />
                        </CCol>
                        <CCol md="6">
                            <CLabel htmlFor="role">Role</CLabel>
                            <CSelect custom name="select" id="select">
                                {roles.map(d => (<li key={d.id}>{d.name}</li>))} 
                            </CSelect>
                        </CCol>
                    </CFormGroup>
                </CForm>
            </CModalBody>
            <CModalFooter>
                <CButton onClick={() => {storeTeam()}} color="primary">Save</CButton>
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
                    Add User
                </CButton>
                </CCardHeader>
            </CCard>
            <CCard>
                <CCardHeader>
                Teams
                <DocsLink name="CModal"/>
                </CCardHeader>
                <CCardBody>
                <CAlert
                color="success"
                show={successVisible}
                closeButton
                onShowChange={setSuccessVisible}
                >
                Team updated
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
                items={users}
                fields={fields}
                itemsPerPage={5}
                pagination
                tableFilter
                columnFilter
                itemsPerPageSelect
                sorter
                hover
                scopedSlots = {{
                    'groupUser':
                    (item)=>(
                        <td>{item.groupuser}</td>
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
                                <CButton size="sm"  onClick={() => {editTeam(item.id)}} color={getBadge('Pending')}>
                                    <CIcon name="cil-pencil" />
                                </CButton>
                                <CButton size="sm"  onClick={() => {deleteTeam(item.id)}} color={getBadge('Banned')}>
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

export default Users
