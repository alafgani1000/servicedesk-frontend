import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
// import '../features/sideBarSlice'

// sidebar nav config
import navigation from './_nav'
import navigation_guest from './_nav_guest'
import navigation_developer from './_nav_developer'
import navigation_technecian from './_nav_technecian'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)
  const role = useSelector(state => state.role)
  var nav = []
  console.log(role)
  if(role === 'admin'){
    nav = navigation
  }else if(role === 'guest'){
    nav = navigation_guest
  }else if(role === 'developer'){
    nav = navigation_developer
  }else if(role === 'technician'){
    nav = navigation_technecian
  }
  
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand style={{ backgroundColor:'white' }} className="d-md-down-none" to="/">
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        /> */}
        <CImg
          src={'logo/logosdesk.png'}
          className="c-sidebar-brand-full"
        />
        {/* <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        /> */}
        <CImg
          src={'logo/logo1.png'}
          className="c-sidebar-brand-minimized"
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={nav}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
