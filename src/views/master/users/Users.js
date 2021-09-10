import React, { useEffect, useState, createRef } from 'react'
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
  CInputCheckbox,
  CFormText,
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
    const [user, setUser] = useState()
    const [roles, setRoles] = useState([])
    const [teams, setTeams] = useState([])
    const [showPassword, setShowPassword] = useState('password')
    const [showRepassword, setShowRepassword] = useState('password')
    const [password, setPassword] = useState()
    const [repassword, setRepassword] = useState()
    const [dataUsers, setDataUsers] = useState({
        name:'',
        username:'',
        email:'',
        group:'',
        level:''
    })
    const [userEdit, setUserEdit] = useState({
        ename:'',
        eusername:'',
        eemail:'',
        egroup:'',
        eemail:'',
        euserid:'',
        epassword:'',
    })
    const [modal, setModal] = useState(false)
    const [modalAdd, setModalAdd] = useState(false)
    const [modalDelete, setModalDelete] = useState(false)
    const [ename, setEname] = useState('')
    const [iname, setIname] = useState('')
    const [eid, setEid] = useState('')
    const [successVisible, setSuccessVisible] = useState(0)
    const [errorVisible, setErrorVisible] = useState(0)
    const [errorStore, setErrorStore] = useState(0)
    const [successStore, setSuccessStore] = useState(0)
    const [errorDelete,setErrorDelete] = useState(0)
    const [successDelete, setSuccessDelete] = useState(0)
    const [timeInterval, setTimeInterval] = useState('')
    const url = useSelector(state => state.baseUrl)
    const dispatch = useDispatch()
    
    const Axs = axios.create({
        headers: {
            token:localStorage.getItem('shitToken')
        },
        baseURL:url
    })

    /**
     * get data users
     */
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

    /**
     * get data roles
     */
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

    /**
     * get data teams
     */
    const getTeams = () => {
        Axs.get(`api/team`, {

        })
        .then(function(response){
            setStatus(response.data.message)
            setTeams(response.data.data)
        })
        .catch(function(){
            history.push('/login')
        })
    }

    /**
     * show modal create user
     */
    const createUser = () => {
        setDataUsers(prevState => {
            return { ...prevState, group:teams[0].id }
        })
        setDataUsers(prevState => {
            return { ...prevState, level:roles[0].id }
        })
        setModalAdd(true)
    }

    /**
     * handle create new user
     * @param {*} event 
     * @returns 
     */
    const handleSubmit = event => {
        event.preventDefault()
        if(password !== repassword){
           return;
        }else{
            Axs.post(`api/user/store`,{
                name:dataUsers.name,
                username:dataUsers.username,
                email:dataUsers.email,
                password:password,
                level:dataUsers.level,
                group:dataUsers.group
            })
            .then(function(res){
                setSuccessStore(10)
                getUsers()
                setModalAdd(false)
                resetDataUsers()
            })
            .catch(function(error){
                setErrorStore(10)
                setModalAdd(false)
            })
        }
    }

    /**
     * menampil modal untuk edit user
     * @param {*} data 
     */
    const editUser = (data) => {
        setUserEdit({
            ename:data.name,
            eusername:data.username,
            eemail:data.email,
            elevel:data.level,
            egroup:data.groupuser,
            euserid:data.id
        })
        setModal(!modal)
    }

    /**
     * proses update data user
     * @param {*} event 
     */
    let handleUpdate = event => {
        event.preventDefault()
        let data = {}
        if(password !== '' && (password === repassword)){
            data = {
                name:userEdit.ename,
                username:userEdit.eusername,
                email:userEdit.eemail,
                level:userEdit.elevel,
                groupuser:userEdit.egroup,
                password:password
            }
        }else{
            data = {
                name:userEdit.ename,
                username:userEdit.eusername,
                email:userEdit.eemail,
                level:userEdit.elevel,
                groupuser:userEdit.egroup
            }
        }
       
        Axs.put(`api/user/${userEdit.euserid}/update`,data)
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

    /**
     * konfirmasi delete data
     * @param {*} data 
     */
    const confirmDelete = (data) => {
        setUser(data)
        setModalDelete(true)
    }

    /**
     * proses delete data
     */
    let deleteUser = () => {
        Axs.delete(`api/user/${user.id}/delete`)
        .then(function(){
            setSuccessDelete(10)
            setModalDelete(false)
            getUsers()
        })
        .catch(function(){
            setErrorStore(10)
        })
    }

    /**
     * show password
     * @param {*} event
     */
    const handleShowPassword = event => {
        if(event.target.checked === true){
            setShowPassword(event.target.value)
        }else{
            setShowPassword("password")
        }
    }
    
    /**
     * show re password
     * @param {*} event
     */
    const handleShowRePassword = event => {
        if(event.target.checked === true){
            setShowRepassword(event.target.value)
        }else{
            setShowRepassword("password")
        }
    }

    /**
     * handle password
     * @param {*} event 
     */
    const handlePassword = event => {
       setPassword(event.target.value)      
    }

    /**
     * handle re password
     * @param {*} event 
     */
    const handleRepassword = event => {
        setRepassword(event.target.value)
    }

    /**
     * handle pair password
     */
    const HandlePairPassword = (props) => {
        if(password === repassword){
            return <CFormText className="help-block"></CFormText>
        }else if(password !== repassword){
            return <CFormText className="help-block" color="danger">Password tidak sama</CFormText>
        }
    }
    
    /**
     * handle change input kecuali untuk password
     * @param {*} event 
     */
    const handleChange = event => {
        const target = event.target
        const name = target.name
        const value = target.value
        setDataUsers(prevState => {
            return { ...prevState, [name]:value}
        })
    }   

    /**
     * handle hange for edit data
     * @param {*} event 
     */
    const handleEditChange = event => {
        const target = event.target
        const name = target.name
        const value = target.value
        setUserEdit(prevState => {
            return {...prevState, [name]:value}
        })
    }

    /**
     * reset state dataUsers
     */
    const resetDataUsers = () => {
        setDataUsers({
            name:'',
            username:'',
            email:'',
            level:'',
            group:'',
        })
        setPassword()
        setRepassword()
    }

    useEffect(() => {
        getUsers()
        getRoles()
        getTeams()
    }, [])

 
    return (
        <>
        <CRow>
            <CModal
            show={modalDelete}
            onClose={setModalDelete}
            size="sm"
            >
                <CModalBody>
                Delete data ?
                </CModalBody>
                <CModalFooter>
                <CButton type="submit" color="danger" onClick={() =>{deleteUser()}}>Delete</CButton>
                <CButton 
                    color="secondary" 
                    onClick={() => {setModalDelete(false)}}
                >Cancel</CButton>
                </CModalFooter>
            </CModal>
            <CModal 
            show={modal} 
            onClose={setModal}
            size="lg"
            >
                <CModalHeader closeButton>
                    <CModalTitle>Edit User</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleUpdate} method="post">
                    <CModalBody>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="ename">Name</CLabel>
                                    <CInput value={userEdit.ename || ""} name="ename" type="text" id="ename" onChange={handleEditChange} required/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="eusername">Username</CLabel>
                                    <CInput value={userEdit.eusername || ""} name="eusername" type="text" id="eusername" onChange={handleEditChange} required readOnly={true} />
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="eemail">Email</CLabel>
                                    <CInput value={userEdit.eemail || ""} name="eemail" type="email" id="eemail" onChange={handleEditChange} required/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="egroup">Team</CLabel>
                                    <CSelect custom name="egroup" id="egroup" onChange={handleEditChange} value={userEdit.egroup || ""}>
                                        {
                                            teams.map((value, index) => {
                                                return <option key={index} value={ value.id }>{ value.name }</option>
                                            })
                                        }
                                    </CSelect>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="4">
                                <CFormGroup>
                                    <CLabel htmlFor="epassword">Password</CLabel>
                                    <CInput type={showPassword} onChange={handlePassword} name="epassword" id="epassword"/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="2" className="mt-2">
                                <CFormGroup variant="custom-checkbox" inline className="mt-4">
                                    <CInputCheckbox custom id="eshow-password" name="eshow-password" onChange={handleShowPassword} value="text"/>
                                    <CLabel variant="custom-checkbox" htmlFor="show-password">Show</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup>
                                    <CLabel htmlFor="erepassword">Re Password</CLabel>
                                    <CInput type={showRepassword} onChange={handleRepassword} name="erepassword" id="erepassword"/>
                                    <HandlePairPassword/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="2" className="mt-2">
                                <CFormGroup variant="custom-checkbox" inline className="mt-4">
                                    <CInputCheckbox onChange={handleShowRePassword} custom id="sehow-repassword" name="sehow-repassword" value="text"/>
                                    <CLabel variant="custom-checkbox" htmlFor="show-repassword">Show</CLabel>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="elevel">Role</CLabel>
                                    <CSelect custom name="elevel" id="elevel" value={userEdit.elevel || ""} onChange={handleEditChange}>
                                    {
                                        roles.map((value, index) => {
                                            return <option key={index} value={ value.id }>{ value.role }</option>
                                        })
                                    }
                                    </CSelect>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                    </CModalBody>
                    <CModalFooter>
                        <CButton type="submit" color="primary">Save</CButton>
                        <CButton 
                        color="secondary" 
                        onClick={() => {setModal(false)}}
                        >Cancel</CButton>
                    </CModalFooter>
                </CForm>
            
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
                <CForm onSubmit={handleSubmit} method="post">
                    <CModalBody>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="name">Name</CLabel>
                                    <CInput name="name" type="text" id="inputName" onChange={handleChange} required/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="userName">Username</CLabel>
                                    <CInput name="username" type="text" id="inputUserName" onChange={handleChange} required/>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="email">Email</CLabel>
                                    <CInput name="email" type="email" id="inputEmail" onChange={handleChange} required/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="group">Team</CLabel>
                                    <CSelect custom name="group" id="group" onChange={handleChange}>
                                        {
                                            teams.map((value, index) => {
                                                return <option key={index} value={ value.id }>{ value.name }</option>
                                            })
                                        }
                                    </CSelect>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="4">
                                <CFormGroup>
                                    <CLabel htmlFor="password">Password</CLabel>
                                    <CInput type={showPassword} onChange={handlePassword} name="password" id="password" required/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="2" className="mt-2">
                                <CFormGroup variant="custom-checkbox" inline className="mt-4">
                                    <CInputCheckbox custom id="show-password" name="show-password" onChange={handleShowPassword} value="text"/>
                                    <CLabel variant="custom-checkbox" htmlFor="show-password">Show</CLabel>
                                </CFormGroup>
                            </CCol>
                            <CCol md="4">
                                <CFormGroup>
                                    <CLabel htmlFor="repassword">Re Password</CLabel>
                                    <CInput type={showRepassword} onChange={handleRepassword} name="repassword" id="repassword" required/>
                                    <HandlePairPassword/>
                                </CFormGroup>
                            </CCol>
                            <CCol md="2" className="mt-2">
                                <CFormGroup variant="custom-checkbox" inline className="mt-4">
                                    <CInputCheckbox onChange={handleShowRePassword} custom id="show-repassword" name="show-repassword" value="text"/>
                                    <CLabel variant="custom-checkbox" htmlFor="show-repassword">Show</CLabel>
                                </CFormGroup>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CCol md="6">
                                <CFormGroup>
                                    <CLabel htmlFor="level">Role</CLabel>
                                    <CSelect custom name="level" id="level" onChange={handleChange}>
                                    {
                                        roles.map((value, index) => {
                                            return <option key={index} value={ value.id }>{ value.role }</option>
                                        })
                                    }
                                    </CSelect>
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
            <CCol xs="12" lg="12">
            <CCard>
                <CCardHeader>
                <CButton onClick={() => {createUser()}} size="sm" color="primary">
                    Add User
                </CButton>
                </CCardHeader>
            </CCard>
            <CCard>
                <CCardHeader>
                Users
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
                    color="success"
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
                    'level':
                    (item)=>(
                        <td>{item.userRole.role}</td>
                    ),
                    'groupUser':
                    (item)=>(
                        <td>{item.userTeam.name}</td>
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
                                <CButton size="sm"  onClick={() => {editUser(item)}} color={getBadge('Pending')}>
                                    <CIcon name="cil-pencil" />
                                </CButton>
                                <CButton size="sm"  onClick={() => {confirmDelete(item)}} color={getBadge('Banned')}>
                                    <CIcon name="cil-trash" />
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
