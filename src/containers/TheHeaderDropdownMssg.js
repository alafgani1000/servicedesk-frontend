import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";

const TheHeaderDropdownMssg = (props) => {
  const dispatch = useDispatch();
  // const linkDashboard = useSelector((state) => state.linkDashboard);
  const url = useSelector((state) => state.baseUrl);

  const history = useHistory();

  const Axios = axios.create({
    headers: {
      token: localStorage.getItem("shitToken"),
      "Content-Type": "multipart/form-data",
    },
    baseURL: url,
  });

  const setIncidentSearch = (data) => {
    const dataJson = JSON.parse(data.data);
    dispatch({ type: "set", incidentSearch: dataJson.text });
    if (data.tableName === "requests") {
      history.push("/transaction/requests");
    } else if (data.tableName === "incidents") {
      history.push("/transaction/incidents");
    }
    readNotif(data);
  };

  const readNotif = (data) => {
    Axios.patch(`api/notifications/${data.id}/read`, {}).then(function (data) {
      if (data.data.message === "Success") {
        Axios.get("api/notifications", {}).then(function (response) {
          dispatch({ type: "set", notifications: response.data.data });
        });
      }
    });
  };

  return (
    <>
      <CDropdown inNav className="c-header-nav-item mx-2" direction="down">
        <CDropdownToggle className="c-header-nav-link" caret={false}>
          {/* <CIcon name="cil-envelope-open" /><CBadge shape="pill" color="info">{itemsCount}</CBadge> */}
          <CIcon name="cil-bell" />
          <CBadge shape="pill" color="danger">
            {props.notifications.length}
          </CBadge>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownItem header tag="div" color="light">
            <strong>You have {props.notifications.length} messages</strong>
          </CDropdownItem>
          {props.notifications.map((value, index) => {
            const data = JSON.parse(value.data);
            return (
              <CDropdownItem
                href="#"
                key={index}
                onClick={() => {
                  setIncidentSearch(value);
                }}
                style={{ minWidth: "200px" }}
              >
                <div className="message">
                  <div className="pt-3 mr-3 float-left">
                    <div className="c-avatar">
                      <CImg
                        src={"avatars/7.jpg"}
                        className="c-avatar-img"
                        alt=""
                      />
                      <span className="c-avatar-status bg-danger"></span>
                    </div>
                  </div>
                  <div>
                    <small className="text-muted font-weight-bold">
                      {value.from.charAt(0).toUpperCase() + value.from.slice(1)}
                    </small>
                  </div>
                  <div className="font-weight-bold">
                    <span className="fa fa-exclamation text-danger"></span>{" "}
                    {value.tableName.charAt(0).toUpperCase() +
                      value.tableName.slice(1)}
                    <CBadge color="success" className="ml-2 mr-2">
                      {value.stage}
                    </CBadge>
                  </div>
                  <div className="small text-muted text-truncate mr-2">
                    {data.text}
                  </div>
                </div>
              </CDropdownItem>
            );
          })}
          <CDropdownItem href="#" className="text-center border-top">
            <strong>View all messages</strong>
          </CDropdownItem>
        </CDropdownMenu>
      </CDropdown>
    </>
  );
};

export default TheHeaderDropdownMssg;
