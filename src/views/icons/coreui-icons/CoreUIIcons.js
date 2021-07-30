import React from 'react'
import { CCard, CCardBody, CCardHeader, CRow } from '@coreui/react'
import { freeSet, cilApple } from '@coreui/icons'
import { getIconsView } from '../brands/Brands.js'
import { DocsLink } from 'src/reusable'

const CoreUIIcons = () => {
  return (
    <CCard>
      <CCardHeader>
        Free Icons / as CIcon{' '}
        <DocsLink href="https://github.com/coreui/coreui-icons" text="GitHub"/>
      </CCardHeader>
      <CCardBody>
        <CRow className="text-center">
          {getIconsView(freeSet)}
          {getIconsView(cilApple)}
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default CoreUIIcons
