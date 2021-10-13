import React from 'react'
import CIcon from '@coreui/icons-react'

  const _nav_guest =  [
      {
        _tag: 'CSidebarNavTitle',
        _children: ['Transactions']
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Incidents',
        to: '/transaction/incidents',
        icon: <CIcon name="cil-settings" customClasses="c-sidebar-nav-icon"/>,
      },
      {
        _tag: 'CSidebarNavItem',
        name: 'Request',
        to: '/transaction/requests',
        icon: <CIcon name="cil-pencil" customClasses="c-sidebar-nav-icon"/>,
      },
    ]

export default _nav_guest
