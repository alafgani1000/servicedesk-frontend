import React, { lazy, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CCard,
  CCardHeader,
  CCardBody,
  CCardTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import ChartLineSimple from "../charts/ChartLineSimple";
import ChartBarSimple from "../charts/ChartBarSimple";
import io from "socket.io-client";

const WidgetsDropdown = () => {
  const dispatch = useDispatch();
  const url = useSelector((state) => state.baseUrl);
  const token = useSelector((state) => state.token);
  const [dataIncident, setDataIncident] = useState({
    incidentNew: 0,
    incidentOpen: 0,
    incidentClose: 0,
    incidentResolve: 0,
  });
  const [dataRequest, setDataRequest] = useState({
    requestNew: 0,
    requestOpen: 0,
    requestClose: 0,
    requestResolve: 0,
  });

  useEffect(() => {
    const socket = io(url);
    socket.on("countIncident", (data) => {
      setDataIncident({
        incidentNew: data.new,
        incidentOpen: data.open,
        incidentClose: data.close,
        incidentResolve: data.resolve,
      });
    });
    socket.on("countRequest", (data) => {
      setDataRequest({
        requestNew: data.new,
        requestOpen: data.open,
        requestClose: data.close,
        requestResolve: data.resolve,
      });
    });
  }, []);
  // render
  return (
    <>
      <CCard>
        <CCardHeader>
          <CCardTitle>Data Incident/Problem</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-primary"
                header={String(dataIncident.incidentNew)}
                text="New ticket"
              >
                <CDropdown>
                  <CDropdownToggle color="transparent">
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-info"
                header={String(dataIncident.incidentOpen)}
                text="Open ticket"
              >
                <CDropdown>
                  <CDropdownToggle caret={false} color="transparent">
                    <CIcon name="cil-location-pin" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-warning"
                header={String(dataIncident.incidentResolve)}
                text="Resolve ticket"
              >
                <CDropdown>
                  <CDropdownToggle color="transparent">
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-danger"
                header={String(dataIncident.incidentClose)}
                text="Close ticket"
              >
                <CDropdown>
                  <CDropdownToggle
                    caret
                    className="text-white"
                    color="transparent"
                  >
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader>
          <CCardTitle>Data Request Sofrware</CCardTitle>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-primary"
                header={String(dataRequest.requestNew)}
                text="New ticket"
              >
                <CDropdown>
                  <CDropdownToggle color="transparent">
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-info"
                header={String(dataRequest.requestOpen)}
                text="Open ticket"
              >
                <CDropdown>
                  <CDropdownToggle caret={false} color="transparent">
                    <CIcon name="cil-location-pin" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-warning"
                header={String(dataRequest.requestResolve)}
                text="Resolve ticket"
              >
                <CDropdown>
                  <CDropdownToggle color="transparent">
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>

            <CCol sm="6" lg="3">
              <CWidgetDropdown
                color="gradient-danger"
                header={String(dataRequest.requestClose)}
                text="Close ticket"
              >
                <CDropdown>
                  <CDropdownToggle
                    caret
                    className="text-white"
                    color="transparent"
                  >
                    <CIcon name="cil-settings" />
                  </CDropdownToggle>
                  <CDropdownMenu className="pt-0" placement="bottom-end">
                    <CDropdownItem>Action</CDropdownItem>
                    <CDropdownItem>Another action</CDropdownItem>
                    <CDropdownItem>Something else here...</CDropdownItem>
                    <CDropdownItem disabled>Disabled action</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </CWidgetDropdown>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default WidgetsDropdown;
