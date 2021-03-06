import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import qs from 'qs'

const Login = () => {
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [status,setStatus] = useState('')
  const dispatch = useDispatch()
  const url = useSelector(state => state.baseUrl)

  const history = useHistory()

  const handleSubmit = event => {
    event.preventDefault()
    axios({
      method:'post',
      url:`${url}/api/auth/sign`,
      data: qs.stringify({
        username:username,
        password:password
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    })
    .then(function (response) {
      localStorage.setItem('shitToken',response.data.token)
      localStorage.setItem('role',response.data.role)
      localStorage.setItem('group',response.data.group)
      localStorage.setItem('name',response.data.name)
      dispatch({type: 'set', role: response.data.role })
      dispatch({type: 'set', group: response.data.group})
      dispatch({type: 'set', token: response.data.token})
      dispatch({type: 'set', nama: response.data.name})
      setStatus(response.data.message)
      if(response.data.message === 'Success'){
        history.push('dashboard');
      }
    })
    .catch(function (error) {
      console.log(error)
    })
    if(status === 'Success'){
      history.push('/dashboard')
    }else{
      history.push('/login')
    }
      
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit} method="post">
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="text" placeholder="Username" autoComplete="username" onChange = {event => setUsername(event.target.value)} />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput type="password" placeholder="Password" autoComplete="current-password" onChange = {event => setPassword(event.target.value)} />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton type="submit" color="primary" className="px-4">Login</CButton>
                      </CCol>
                      <CCol xs="6" className="text-right">
                        <CButton color="link" className="px-0">Forgot password?</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>Apabila tidak mempunyai akun, Klik register untuk membuat akun terlebih dahulu.</p>
                    <Link to="/register">
                      <CButton color="secondary " className="mt-3" active tabIndex={-1}>Register Now!</CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
