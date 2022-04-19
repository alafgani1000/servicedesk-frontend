import React, { useEffect, useState } from "react";
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
} from "@coreui/react";
import { DocsLink } from "src/reusable";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";

const getBadge = (actions) => {
  switch (actions) {
    case "Active":
      return "success";
    case "Inactive":
      return "secondary";
    case "Pending":
      return "warning";
    case "Banned":
      return "danger";
    default:
      return "primary";
  }
};

const fields = ["name", "time_interval", "createdAt", "updatedAt", "actions"];

const Categories = () => {
  let history = useHistory();
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [ename, setEname] = useState("");
  const [einterval, setEinterval] = useState("");
  const [eid, setEid] = useState("");
  const [iname, setIname] = useState("");
  const [iinterval, setIinterval] = useState("");
  const [delid, setDelid] = useState("");
  const [successVisible, setSuccessVisible] = useState(0);
  const [errorVisible, setErrorVisible] = useState(0);
  const [errorStore, setErrorStore] = useState(0);
  const [successStore, setSuccessStore] = useState(0);
  const [errorDelete, setErrorDelete] = useState(0);
  const [successDelete, setSuccessDelete] = useState(0);
  const url = useSelector((state) => state.baseUrl);

  const Axs = axios.create({
    headers: {
      token: localStorage.getItem("shitToken"),
    },
    baseURL: url,
  });

  const getCategories = () => {
    Axs.get(`api/category/`, {})
      .then(function (response) {
        setCategories(response.data.data);
      })
      .catch(function (error) {
        history.push("/login");
      });
  };

  const editStage = (item) => {
    setEid(item.id);
    setEname(item.name);
    setEinterval(item.time_interval);
    setModal(!modal);
  };

  const deleteConfirm = (item) => {
    setDelid(item.id);
    setModalDelete(!modalDelete);
  };

  const updateStage = (id) => {
    Axs.put(`api/category/${id}/update`, {
      name: ename,
      interval: einterval,
    })
      .then(function (res) {
        setSuccessVisible(10);
        getCategories();
        setModal(false);
      })
      .catch(function (error) {
        setErrorVisible(10);
        setModal(false);
      });
  };

  const storeStage = (id) => {
    Axs.post(`api/category/store`, {
      name: iname,
      interval: iinterval,
    })
      .then(function (res) {
        setSuccessStore(5);
        getCategories();
        setModalAdd(false);
      })
      .catch(function (error) {
        setErrorStore(5);
        setModalAdd(false);
      });
  };

  let deleteCategory = (id) => {
    Axs.delete(`api/category/${id}/delete`, {})
      .then(function () {
        setSuccessDelete(10);
        getCategories();
        setModalDelete(false);
      })
      .catch(function () {
        setErrorStore(10);
        setModalDelete(false);
      });
  };

  let addCategory = () => {
    setModalAdd(!modal);
    setIname("");
    setIinterval("");
  };

  useEffect(() => {
    Axs.get(`api/category/`, {})
      .then(function (response) {
        setCategories(response.data.data);
      })
      .catch(function (error) {
        history.push("/login");
      });
  }, [Axs, history]);

  return (
    <>
      <CRow>
        <CModal show={modal} onClose={setModal}>
          <CModalHeader closeButton>
            <CModalTitle>Edit Stage</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="ename">Text</CLabel>
                  <CInput
                    value={ename}
                    onChange={(event) => setEname(event.target.value)}
                    id="ename"
                    placeholder="Enter name category"
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="einterval">Description</CLabel>
                  <CInput
                    value={einterval}
                    onChange={(event) => setEinterval(event.target.value)}
                    id="einterval"
                    placeholder="Time interval"
                    required
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              onClick={() => {
                updateStage(eid);
              }}
              color="primary"
            >
              Update
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setModal(false);
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CModal show={modalDelete} onClose={setModalDelete}>
          <CModalHeader closeButton>
            <CModalTitle>Confirm</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CLabel>Delete data ?</CLabel>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              onClick={() => {
                deleteCategory(delid);
              }}
              color="primary"
            >
              Delete
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setModalDelete(false);
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        {/* add modal */}
        <CModal show={modalAdd} onClose={setModalAdd}>
          <CModalHeader closeButton>
            <CModalTitle>Add Category</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CRow>
              <CCol xs="12">
                <CFormGroup>
                  <CLabel htmlFor="name">Name</CLabel>
                  <CInput
                    onChange={(event) => setIname(event.target.value)}
                    id="name"
                    value={iname}
                    placeholder="Enter name category"
                    required
                  />
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="interval">Interval</CLabel>
                  <CInput
                    onChange={(event) => setIinterval(event.target.value)}
                    id="interval"
                    value={iinterval}
                    placeholder="Interval"
                    required
                  />
                </CFormGroup>
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton
              onClick={() => {
                storeStage();
              }}
              color="primary"
            >
              Save
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setModalAdd(false);
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButton
                onClick={() => {
                  addCategory();
                }}
                size="sm"
                color="primary"
              >
                Add Category
              </CButton>
            </CCardHeader>
          </CCard>
          <CCard>
            <CCardHeader>
              Categories
              <DocsLink name="CModal" />
            </CCardHeader>
            <CCardBody>
              <CAlert
                color="success"
                show={successVisible}
                closeButton
                onShowChange={setSuccessVisible}
              >
                Role updated
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
                items={categories}
                fields={fields}
                itemsPerPage={5}
                pagination
                scopedSlots={{
                  createdAt: (item) => (
                    <td>{moment(item.createdAt).format("DD-MM-YYYY H:m:s")}</td>
                  ),
                  updatedAt: (item) => (
                    <td>{moment(item.updatedAt).format("DD-MM-YYYY H:m:s")}</td>
                  ),
                  actions: (item) => (
                    <td>
                      <CButton
                        size="sm"
                        onClick={() => {
                          editStage(item);
                        }}
                        color={getBadge("Pending")}
                        className="mr-1"
                      >
                        Edit
                      </CButton>
                      <CButton
                        size="sm"
                        onClick={() => {
                          deleteConfirm(item);
                        }}
                        color={getBadge("Banned")}
                        className="mr-1"
                      >
                        Delete
                      </CButton>
                    </td>
                  ),
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Categories;
