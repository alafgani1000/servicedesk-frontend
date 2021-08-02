import React from 'react'
import CIcon from '@coreui/icons-react'
import { IoPeopleCircleSharp } from 'react-icons/io5'

const _nav =  [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon"/>,
    badge: {
      color: 'info',
      text: 'NEW',
    }
  },
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
    to: '/theme/colors',
    icon: <CIcon name="cil-pencil" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Master Data']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Teams',
    to: '/master/teams',
    icon: <CIcon name="cil-star" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Roles',
    to: '/master/roles',
    icon: <CIcon name="cil-puzzle" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Stages',
    to: '/master/stages',
    icon: <CIcon name="cil-puzzle" customClasses="c-sidebar-nav-icon"/>,
  },
  {
    _tag: 'CSidebarNavTitle',
    _children: ['Config']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Users',
    to: '/master/roles',
    icon: 'cil-user'
  },
]

export default _nav
