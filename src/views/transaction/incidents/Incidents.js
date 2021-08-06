import React, { useEffect, useState, createRef } from 'react'
import classNames from 'classnames'
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
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import usersData from '../../users/UsersData'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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

const fields = ['text','location', 'phone','category','stage','startDate','endDate','createdAt','updatedAt', 'actions']

const Incidents = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [status, setStatus] = useState(null)
  const [incidents, setIncidents] = useState([])
  const url = useSelector((state) => state.url.value)
  const [modal, setModal] = useState(false)
  const [modalAdd, setModalAdd] = useState(false)
  const dispatch = useDispatch();

  const Axs = axios.create({
    headers: {
      token: localStorage.getItem('shitToken')
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
        
      })
  }

  useEffect(() => {
    getIncidents()
  },[])

 
  return (
    <>
      <CRow>
        {/* modal */}
        <CModal 
          show={modalAdd} 
          onClose={setModalAdd}
          size="xl"
        >
          <CModalHeader closeButton>
            <CModalTitle>New Incident</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="text">Incident/Problem</CLabel>
                  <CInput id="text" placeholder="Ketikan masalah yang anda alami" required />
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="location">Location</CLabel>
                    <CInput id="location" placeholder="Lokasi" required />
                </CFormGroup>
                <CFormGroup>
                    <CLabel htmlFor="phone">Interval</CLabel>
                    <CInput id="phone" placeholder="Nomor Telephone" required />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary">Save</CButton>
            <CButton 
              color="secondary" 
              onClick={() => {setModalAdd(false)}}
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
                    <CButton size="sm"  onClick={() => {}} color={getBadge('Pending')} className="mr-1">
                      Edit
                    </CButton>
                    <CButton size="sm"  onClick={() => {}} color={getBadge('Banned')} className="mr-1">
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

export default Incidents
