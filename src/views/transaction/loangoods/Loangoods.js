import React, { useEffect, useState, useReducer, useRef } from "react";
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
  CForm,
  CTextarea,
  CSelect,
  CInputFile,
  CButtonGroup,
  CCardFooter,
  CCardTitle,
  CCardText,
  CLink,
  CAlert,
  CProgress,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { DocsLink } from "src/reusable";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Swal from "sweetalert2";
import io from "socket.io-client";

const getBadge = (stage) => {
  switch (stage) {
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

const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value,
  };
};

const fields = [
  "nopegawai",
  "kodeBarang",
  "namaBarang",
  "Pinjam",
  "Kembali",
  "createdAt",
  "updatedAt",
  "actions",
];

const Loangoods = () => {
  const [status, setStatus] = useState(null);
  const [peminjamans, setPeminjamans] = useState([]);
  const [peminjaman, setPeminjaman] = useState();
  const [modalAdd, setModalAdd] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalReturn, setModalReturn] = useState(false);
  const [successCreate, setSuccessCreate] = useState(0);
  const [successReturn, setSuccessReturn] = useState(0);
  const [failCreate, setFailCreate] = useState(0);
  const [responseMessage, setResponseMessage] = useState("");
  const [nopegawai, setNopegawai] = useState("");
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [enopegawai, setEnopegawai] = useState("");
  const [ekodeBarang, setEkodeBarang] = useState("");
  const [enamaBarang, setEnamaBarang] = useState("");

  const url = useSelector((state) => state.baseUrl);
  const role = useSelector((state) => state.role);
  const incidentSearch = useSelector((state) => state.incidentSearch);
  const dispatch = useDispatch();

  const history = useHistory();

  /**
   * setting base axios
   */
  const Axs = axios.create({
    headers: {
      token: localStorage.getItem("shitToken"),
      "Content-Type": "multipart/form-data",
    },
    baseURL: url,
  });

  /**
   * setting base axios
   */
  const Asios = axios.create({
    headers: {
      token: localStorage.getItem("shitToken"),
    },
    baseURL: url,
  });

  /**
   * get data loan goods
   */
  const getPeminjamans = () => {
    Axs.get("api/peminjaman/data", {})
      .then(function (response) {
        // handle success
        setStatus(response.data.status);
        setPeminjamans(response.data.data);
      })
      .catch(function (error) {
        history.push("/login");
      });
  };

  /**
   * get data peminjaman
   */
  const getPeminjaman = () => {
    Axs.get(`api/peminjaman/${peminjaman.id}`, {})
      .then(function (response) {
        setPeminjaman(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const newPeminjaman = () => {
    setModalAdd(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    Asios.post("/api/peminjaman/pinjam", {
      nopegawai: nopegawai,
      kode_barang: kodeBarang,
      nama_barang: namaBarang,
    })
      .then(function (response) {
        setModalAdd(false);
        setResponseMessage("Input success");
        setSuccessCreate(10);
        getPeminjamans();
        resetForm();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    Asios.put(`/api/peminjaman/${peminjaman.id}/update`, {
      nopegawai: enopegawai,
      kodeBarang: ekodeBarang,
      namaBarang: enamaBarang,
    })
      .then(function (response) {
        setModalEdit(false);
        setResponseMessage("Update success");
        setSuccessCreate(10);
        getPeminjamans();
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const deletePeminjaman = (peminjaman) => {
    Asios.delete(`/api/peminjaman/${peminjaman.id}/delete`, {})
      .then(function (respose) {
        setModalDelete(false);
        getPeminjamans();
        setResponseMessage("Delete success");
        setSuccessCreate(10);
      })
      .catch(function (response) {
        console.log(response);
      });
  };

  const returnPeminjaman = (peminjaman) => {
    Asios.put(`/api/peminjaman/${peminjaman.id}/kembali`, {})
      .then(function (response) {
        setModalReturn(false);
        getPeminjamans();
        setResponseMessage("Return success");
        setSuccessReturn(10);
      })
      .catch(function () {
        setFailCreate("Return fail");
      });
  };

  const edit = (peminjaman) => {
    setPeminjaman(peminjaman);
    setModalEdit(true);
    setEnopegawai(peminjaman.nopegawai);
    setEkodeBarang(peminjaman.kodeBarang);
    setEnamaBarang(peminjaman.namaBarang);
  };

  const deleteConfirm = (peminjaman) => {
    setPeminjaman(peminjaman);
    setModalDelete(true);
  };

  const returnConfirm = (peminjaman) => {
    setPeminjaman(peminjaman);
    setModalReturn(true);
  };

  const resetForm = () => {
    setNopegawai("");
    setKodeBarang("");
    setNamaBarang("");
  };

  const reset = () => {};

  useEffect(() => {
    getPeminjamans();
  }, []);

  const ReturnButton = (props) => {
    if (props.tanggal === "") {
      return (
        <CTooltip content="Return" placement="top-end">
          <CButton
            className="text-white"
            size="sm"
            color={getBadge("Primary")}
            onClick={() => returnConfirm(props.item)}
          >
            <CIcon name="cil-task" />
          </CButton>
        </CTooltip>
      );
    } else {
      return "";
    }
  };

  return (
    <>
      <CRow>
        {/* modal add */}
        <CCol xs="12" lg="12">
          <CAlert
            color="success"
            show={successCreate}
            closeButton
            onShowChange={setSuccessCreate}
          >
            {responseMessage}
            <CProgress
              striped
              color="success"
              value={Number(successCreate) * 10}
              size="xs"
              className="mb-3"
            />
          </CAlert>
          <CAlert
            color="success"
            show={successReturn}
            closeButton
            onShowChange={setSuccessReturn}
          >
            {responseMessage}
            <CProgress
              striped
              color="success"
              value={Number(successCreate) * 10}
              size="xs"
              className="mb-3"
            />
          </CAlert>

          <CAlert
            color="success"
            show={failCreate}
            closeButton
            onShowChange={setSuccessReturn}
          >
            {responseMessage}
            <CProgress
              striped
              color="success"
              value={Number(failCreate) * 10}
              size="xs"
              className="mb-3"
            />
          </CAlert>
        </CCol>
        {/* modal add */}
        <CModal show={modalAdd} onClose={setModalAdd} size="lg">
          <CForm onSubmit={handleSubmit} method="post">
            <CModalHeader>
              <CModalTitle>New Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol sx="12">
                  <CFormGroup>
                    <CLabel htmlFor="nopegawai">Nopegawai</CLabel>
                    <CInput
                      id="nopegawai"
                      name="nopegawai"
                      onChange={(event) => setNopegawai(event.target.value)}
                      value={nopegawai}
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="kodeBarang">Kode Barang</CLabel>
                    <CInput
                      id="kodeBarang"
                      name="kodeBarang"
                      onChange={(event) => setKodeBarang(event.target.value)}
                      value={kodeBarang}
                      required
                    />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="namaBarang">Nama Barang</CLabel>
                    <CInput
                      id="namaBarang"
                      name="namaBarang"
                      onChange={(event) => setNamaBarang(event.target.value)}
                      value={namaBarang}
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButtonGroup>
                <CButton type="submit" color="primary">
                  Save
                </CButton>
                <CButton
                  type="button"
                  color="warning"
                  className="text-white"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setModalAdd(false);
                  }}
                >
                  Cancel
                </CButton>
              </CButtonGroup>
            </CModalFooter>
          </CForm>
        </CModal>
        {/* modal edit */}
        <CModal show={modalEdit} onClose={setModalEdit} size="lg">
          <CForm onSubmit={handleUpdate} method="post">
            <CModalHeader>
              <CModalTitle>Update Incident</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <CRow>
                <CCol sx="12">
                  <CFormGroup>
                    <CLabel htmlFor="nopegawai">Nopegawai</CLabel>
                    <CInput
                      id="enopegawai"
                      name="enopegawai"
                      onChange={(event) => setEnopegawai(event.target.value)}
                      value={enopegawai}
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="kodeBarang">Kode Barang</CLabel>
                    <CInput
                      id="ekodeBarang"
                      name="ekodeBarang"
                      onChange={(event) => setEkodeBarang(event.target.value)}
                      value={ekodeBarang}
                      required
                    />
                  </CFormGroup>
                </CCol>
                <CCol sx="6">
                  <CFormGroup>
                    <CLabel htmlFor="namaBarang">Nama Barang</CLabel>
                    <CInput
                      id="enamaBarang"
                      name="enamaBarang"
                      onChange={(event) => setEnamaBarang(event.target.value)}
                      value={enamaBarang}
                      required
                    />
                  </CFormGroup>
                </CCol>
              </CRow>
            </CModalBody>
            <CModalFooter>
              <CButtonGroup>
                <CButton type="submit" color="primary">
                  Save
                </CButton>
                <CButton
                  color="secondary"
                  onClick={() => {
                    setModalEdit(false);
                  }}
                >
                  Cancel
                </CButton>
              </CButtonGroup>
            </CModalFooter>
          </CForm>
        </CModal>
        {/* modal delete */}
        <CModal show={modalDelete} onClose={setModalDelete} size="sm">
          <CModalBody>Delete ?</CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              color="danger"
              onClick={() => deletePeminjaman(peminjaman)}
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
        {/* modal return */}
        <CModal show={modalReturn} onClose={setModalReturn} size="sm">
          <CModalBody>Return ?</CModalBody>
          <CModalFooter>
            <CButton
              type="submit"
              color="danger"
              onClick={() => returnPeminjaman(peminjaman)}
            >
              Return
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                setModalReturn(false);
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
        {/* data table */}
        <CCol xs="12" lg="12">
          <CCard>
            <CCardHeader>
              <CButtonGroup>
                <CButton
                  color="primary"
                  onClick={() => {
                    newPeminjaman();
                  }}
                >
                  New
                  <CIcon className="ml-2 mb-2" name="cil-plus"></CIcon>
                </CButton>
                <CButton color="info">
                  Refresh
                  <CIcon className="ml-2 mb-2" name="cil-reload"></CIcon>
                </CButton>
              </CButtonGroup>
            </CCardHeader>
          </CCard>
          <CCard>
            <CCardHeader>
              Loan Goods
              <DocsLink name="CModal" />
            </CCardHeader>
            <CCardBody>
              <CDataTable
                items={peminjamans}
                fields={fields}
                itemsPerPage={5}
                pagination
                columnFilter
                tableFilter
                tableFilterValue={incidentSearch}
                sorter
                itemsPerPageSelect
                scopedSlots={{
                  Pinjam: ($item) => <td>{$item.tanggalPinjam}</td>,
                  Kembali: ($item) => <td>{$item.tanggalKembali}</td>,
                  createdAt: (item) => (
                    <td>{moment(item.createdAt).format("DD-MM-YYYY H:m:s")}</td>
                  ),
                  updatedAt: (item) => (
                    <td>{moment(item.updatedAt).format("DD-MM-YYYY H:m:s")}</td>
                  ),
                  actions: (item) => (
                    <td>
                      <CButtonGroup>
                        <CTooltip content="Edit" placement="top-end">
                          <CButton
                            className="text-white"
                            size="sm"
                            color={getBadge("Pending")}
                            onClick={() => edit(item)}
                          >
                            <CIcon name="cil-pencil" />
                          </CButton>
                        </CTooltip>
                        <CTooltip content="Delete" placement="top-end">
                          <CButton
                            className="text-white"
                            size="sm"
                            color={getBadge("Banned")}
                            onClick={() => deleteConfirm(item)}
                          >
                            <CIcon name="cil-trash" />
                          </CButton>
                        </CTooltip>
                        <ReturnButton
                          tanggal={item.tanggalKembali}
                          item={item}
                        />
                        {/* <CTooltip content="Detail" placement="top-end">
                          <CButton size="sm" color={getBadge("Inactive")}>
                            <CIcon name="cil-description" />
                          </CButton>
                        </CTooltip> */}
                      </CButtonGroup>
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

export default Loangoods;
