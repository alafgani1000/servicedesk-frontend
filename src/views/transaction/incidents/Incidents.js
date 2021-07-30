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
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import usersData from '../../users/UsersData'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

const getBadge = status => {
  switch (status) {
    case 'Active': return 'success'
    case 'Inactive': return 'secondary'
    case 'Pending': return 'warning'
    case 'Banned': return 'danger'
    default: return 'primary'
  }
}

const fields = ['name','registered', 'role', 'status']

const Incidents = () => {
  const [isLogin, setIsLogin] = useState(false)
  const [status, setStatus] = useState(null)

  const getTeam = () => {
      axios.get('http://localhost:4001/api/team',{
        headers: {
          token:localStorage.getItem('shitToken')
        }
      })
      .then(function (response) {
        // handle success
        setStatus(response.data.status)
      })
      .catch(function (error) {
        
      })
  }

  useEffect(() => {
      getTeam()
    },[])

 
  return (
    <>
      <CRow>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              Simple Table
              <DocsLink name="CModal"/>
            </CCardHeader>
            <CCardBody>
            <CDataTable
              items={usersData}
              fields={fields}
              itemsPerPage={5}
              pagination
              scopedSlots = {{
                'status':
                  (item)=>(
                    <td>
                      <CBadge color={getBadge(item.status)}>
                        {item.status}
                      </CBadge>
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
