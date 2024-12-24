import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import { io } from "socket.io-client";
import { MdBlurLinear } from "react-icons/md";
import { FaWindowClose } from "react-icons/fa";
import ToggleButton from 'react-toggle-button'
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Popover,
  TextField,
  Modal,
  Box,
  Snackbar,
  Alert,
  Card, CardContent, Divider, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
// import DatePickerComp from "./Calendar";
import DateRangePickerComp from "./Calendar2dates";
import {
  downloadExcel, getSAPurl, setSAPurl,
  capture_1,
  capture_3,
  enable_autocapture,
  updateMetadata
} from "./authservice/api";
// import Video from "./volumetric/video";
// import VideoComponent from "./updatedVideoPage";
import logo from "./image/logo.jpeg";
import WorkflowStatus from "./WorkflowStatus";
export default function Home2() {
  const src = "http://localhost:8000/video";
  const [socket, setSocket] = useState(null);
  const [product, setproduct] = useState(null);
  const [allproduct, setallproduct] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sapData, setSapData] = useState(null);
  const videoRef = useRef();
  const [ocrResult, setOcrResult] = useState(null);
  const [allOcrResults, setAllOcrResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAutocaptureEnabled, setIsAutocaptureEnabled] = useState(true); // initial state of toggle
  const [currentRow, setCurrentRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState([]); // Add this state


  const handleStartClick = async () => {
    setIsLoading(true);
    try {
      // Make a POST request to send the frame to the server and initiate processing
      const res = await capture_1();
      console.log(res);

      if (res && res.data) {
        // Simply setup the socket to listen for updates
        // setupSocket();
        console.log(res.data);

      } else {
        console.warn("Failed to capture frame.");
      }
    } catch (error) {
      console.error("Error capturing frames:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStopClick = async () => {
    setIsLoading(true);
    try {
      // Make a POST request to send the frame to the server and initiate processing
      const res = await capture_3();
      console.log(res);

      if (res && res.data) {
        // Simply setup the socket to listen for updates
        // setupSocket();
        console.log(res.data);

      } else {
        console.warn("Failed to capture frame.");
      }
    } catch (error) {
      console.error("Error capturing frames:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setEditedData(row);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
  
      // Prepare the data to be sent to the backend
      const updateData = {
        batch_no: editedData.batchNo,
        mrp: editedData.mrp,
        mfg_date: editedData.mfgDate,
        expiry_date: editedData.expDate
      };

      console.log("Sending update with:", {
        metadata_id: editedData.metadata_id,
        updateData: updateData
      });
  
      // Make API call to update the database
      const response = await updateMetadata(editedData.metadata_id, updateData);
  
      if (response.data) {  // Check response from your backend
        // Update local state
        setTableData(tableData.map((item) => 
          item.metadata_id === editedData.metadata_id ? {
            ...item,
            batchNo: editedData.batchNo,
            mrp: editedData.mrp,
            mfgDate: editedData.mfgDate,
            expDate: editedData.expDate
          } : item
        ));
  
        // setSnackbarConfig({
        //   open: true,
        //   message: "Row updated successfully",
        //   severity: "success",
        // });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating row:", error);
      // setSnackbarConfig({
      //   open: true,
      //   message: "Failed to update row",
      //   severity: "error",
      // });
    } finally {
      setIsLoading(false);
      handleCloseConfirmDialog();
      handleCloseDialog();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };
  const handleToggle = async () => {
    setIsLoading(true);
    const newToggleValue = !isAutocaptureEnabled;
    try {
      const res = await enable_autocapture(newToggleValue);
      if (res?.data?.status === 'success') {
        setIsAutocaptureEnabled(newToggleValue);
        console.log("Autocapture state updated:", res.data.message);
      } else {
        console.warn("Failed to toggle autocapture:", res?.data?.message);
      }
    } catch (error) {
      console.error("Error in toggling autocapture:", error);
      setIsAutocaptureEnabled(!newToggleValue); // Revert the toggle if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("OCR Result on render:", ocrResult);
  }, [ocrResult]);
  const [snackbarConfig, setSnackbarConfig] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const renderSection = (label, value) => {
    const isValuePresent = value !== null && value !== undefined && value !== '';
    return (
      <div className="flex items-center p-2">
        <div className={`w-20 h-14 mr-4 rounded-lg flex items-center justify-center ${isValuePresent ? 'bg-green-500' : 'bg-red-500'}`}>
          {/* <span className="text-white font-bold text-xl">{isValuePresent ? '✓' : '✗'}</span> */}
        </div>
        <div className="flex-grow">
          <Typography variant="h4" className={`mt-1 ${isValuePresent ? 'text-gray-700' : 'text-red-500 italic'}`}>
            {isValuePresent ? value : 'No data'}
          </Typography>
          <Typography variant="body1" component="div" className="font-bold text-gray-800">
            {label}
          </Typography>
        </div>
      </div>
    );
  };

  const getLatestRowData = (tableData, field) => {
    if (tableData && tableData.length > 0) {
      return tableData[0][field] || null;
    }
    return null;
  };


  const setupSocket = () => {
    if (!socket) {
      // Establish socket connection to the backend
      const newSocket = io('http://localhost:5000', {  // Change this to your Node.js server URL
        transports: ['websocket'],  // Use WebSocket transport
        withCredentials: true,      // Allow credentials
      });


      newSocket.on("disconnect", () => {
        setSocket(null);
        console.log("Socket disconnected. Attempting to reconnect...");
        setTimeout(setupSocket, 3000);
      });

      newSocket.on("connect", () => {
        console.log("Socket Connected!");  // Add this log to confirm the connection
      });

      // Handle barcode events
      newSocket.on("barcode", (data) => {
        console.log("Received barcode from socket:", data);
        // Create a new row with the barcode
        const newRow = {
          barcode: data,
          batchNo: null,
          mrp: null,
          mfgDate: null,
          expDate: null,
          timestamp: new Date().toISOString()
        };
        setCurrentRow(newRow);
        setTableData(prevData => [newRow, ...prevData]);
      });

      // Handle metadata events
      newSocket.on("metadata", (data) => {
        console.log("Received metadata from socket:", data);
        setOcrResult(data);

        // Update the current row with the new metadata
        setTableData(prevData => {
          if (prevData.length === 0) return prevData;

          const updatedData = [...prevData];
          const firstRow = { ...updatedData[0] };

          // Update the first row with new metadata
          firstRow.metadata_id = data.metadata_id;
          firstRow.batchNo = data['batch_no'] || firstRow.batchNo;
          firstRow.mrp = data['mrp'] || firstRow.mrp;
          firstRow.mfgDate = data['mfg_date'] || firstRow.mfgDate;
          firstRow.expDate = data['expiry_date'] || firstRow.expDate;

          updatedData[0] = firstRow;
          return updatedData;
        });
      });


      newSocket.on("status-updates", (data) => {
        // console.log("Received status updates from socket:", data);
        setStatusUpdates(data); // Store the status updates in state
      })



      setSocket(newSocket);
    }
  };



  // Call setupSocket once when the component mounts
  useEffect(() => {
    setupSocket();
  }, []);

  // const dummyData = Array.from({ length: 20 }, (_, index) => ({
  //   ean_number: generateRandomEAN(),
  //   length: getRandomInt(1, 100),
  //   breadth: getRandomInt(1, 100),
  //   height: getRandomInt(1, 100),
  //   weight: getRandomInt(1, 100)
  // }));

  // console.log(dummyData);

  function exportToExcel(data, filename) {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook and trigger download
    XLSX.writeFile(workbook, filename);
  }


  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const isValidURL = (url) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [defaultUrl, setDefaultUrl] = useState("");
  const [error, setError] = useState(false);

  const handleOpen = () => {
    setModalOpen(true);
    handlegetSAPurl();
  };
  const handleClose = () => setModalOpen(false);

  const handleUrlChange = (event) => {
    const newUrl = event.target.value;
    setUrl(newUrl);
    setError(!isValidURL(event.target.value));
  };

  const handleSave = () => {
    if (isValidURL(url)) {
      // Handle the valid URL here
      console.log("Valid URL:", url);
      handlesetSAPurl();
      setUrl(url);
      handleClose();
    } else {
      setError(true);
    }
  };
  const [fileExcel, setFileExcel] = useState(null);
  const handleDownload = async () => {
    const { startDate, endDate } = selectedDateRange;
    if (startDate && endDate) {
      try {
        const res = await downloadExcel(startDate, endDate);
        console.log("Download response:", res);
        setFileExcel(res);
        if (res) {
          exportToExcel(
            res,
            `Products_${selectedDateRange.toString().slice(0, 10)}.xlsx`
          );
          setSnackbarConfig({
            open: true,
            message: "File downloaded successfully",
            severity: "success",
          });
        } else {
          setSnackbarConfig({
            open: true,
            message: "No data to download",
            severity: "warning",
          });
        }
      } catch (error) {
        console.error("Download error:", error);
        setSnackbarConfig({
          open: true,
          message: "Failed to download file",
          severity: "error",
        });
      }
    } else {
      console.log("Please select a valid date range");
      setSnackbarConfig({
        open: true,
        message: "Please select a valid date range",
        severity: "warning",
      });
    }
    setAnchorEl(null);
  };

  const handlegetSAPurl = async () => {
    try {
      const res = await getSAPurl();
      if (res && res.data && res.data[0] && res.data[0].data) {
        setUrl(res.data[0].data.api_url);
        setDefaultUrl(res.data[0].data.api_url);
        setSapData(res.data[0].data);
        console.log("SAP URL fetched:", url);
        setSnackbarConfig({
          open: true,
          message: "SAP config fetched successfully",
          severity: "success",
        });
      } else {
        console.log("Error in fetching SAP config");
        setSnackbarConfig({
          open: true,
          message: "Failed to fetch SAP config",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("SAP config fetch error:", error);
      setSnackbarConfig({
        open: true,
        message: "Error fetching SAP config",
        severity: "error",
      });
    }
  };
  // handlegetSAPurl();
  console.log("this data i get", sapData);

  useEffect(() => {
    // Update the body object whenever the URL changes
    const updatedBody = {
      ...sapData,
      api_url: url,
    };
    setBody(updatedBody);
  }, [url, sapData]);

  const [body, setBody] = useState({});

  const handlesetSAPurl = async () => {
    const res = await setSAPurl(body);
    console.log("the body is", body);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [extend, setExtend] = useState();
  const [startCamera, setStartCamera] = useState(null);
  const handleExtendsValue = (newValue) => {
    // Do something with the new value in the parent component
    // console.log("Received value from child:", newValue);
    setExtend(newValue);
  };

  return (
    <>
      <div
        className={`w-full flex flex-col justify-center items-center p-0 font-sans ${anchorEl ? `backdrop-blur-xl opacity-20 bg-gray-300` : ``
          }`}
      >
        <div className="w-full flex justify-between">
          {/* <h1 className="text-xl md:text-3xl">Product Details</h1> */}
          <div className="flex">
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <div className="p-4 z-20">
              <DateRangePickerComp
                setSelectedDateRange={setSelectedDateRange}
              />
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{ mt: 2 }}
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </Popover>
        </div>
        <div className="flex w-[100vw] h-[100vh] m-4 rounded-lg gap-3 justify-center flex-wrap">
          {/* <div> */}
          <Grid
            container
            spacing={2}
            className="-z-[20px] w-[100vw] h-[80vh]"
          >


            <Grid
              item
              xs={12}
              md={6}
              className=""
            >
              <div id="container" className="">
                {src ? (
                  <>
                    <Paper elevation={4} className="w-[100%] h-[700px] relative p-5 ">
                      {/* <div className="w-full h-full rounded-lg" > */}
                      <img ref={videoRef} src={src} alt="Video Stream" controls
                        className="w-full h-[600px] rounded-lg"
                        onError={() => console.error("Video stream failed to load")}
                      />

                      {/* </div> */}
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleStartClick}
                          style={{ marginRight: '20px' }}
                        >
                          Capture 1
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          onClick={handleStopClick}
                          style={{ marginRight: '20px' }}
                        >
                          Capture 3
                        </Button>

                        {/* <ToggleButton
                          value={isAutocaptureEnabled} // Set the button's value based on state
                          onToggle={handleToggle} // Call handleToggle on toggle
                          disabled={isLoading} // Disable toggle when loading
                        /> */}

                        <div className={`relative inline-flex items-center ${isLoading ? 'opacity-50' : ''}`}>
                          <ToggleButton
                            value={isAutocaptureEnabled}
                            onToggle={!isLoading ? handleToggle : null}
                            disabled={isLoading}
                            thumbStyle={{
                              width: '15px',
                              height: '15px',
                              borderRadius: '50%',
                              backgroundColor: '#ffffff',
                              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)'
                            }}
                            trackStyle={{
                              width: '100px',
                              height: '35px',
                              borderRadius: '25px',
                              backgroundColor: isAutocaptureEnabled ? '#4caf50' : '#cccccc',
                              transition: 'background-color 0.3s'
                            }}
                          />
                        </div>
                      </div>

                    </Paper>
                    
                    {/* <div style={{ background: 'lightgray' }} className="flex justify-around w-[100vw] h-26 mt-1 p-5">
                      {tableData.length > 0 && [
                        { label: 'EAN', value: tableData[0]?.barcode },
                        { label: 'Batch No.', value: tableData[0]?.batchNo },
                        { label: 'MRP', value: tableData[0]?.mrp },
                        { label: 'MFG', value: tableData[0]?.mfgDate },
                        { label: 'EXP', value: tableData[0]?.expDate }
                      ].map((item, index) => (
                        <Paper key={index} sx={{ width: '20%' }} elevation={4} className="p-4">
                          {renderSection(item.label, item.value)}
                        </Paper>
                      ))}
                    </div> */}
                  </>
                ) : (
                  <>
                    <div className="h-full flex flex-col justify-center">
                      <img src={logo} alt="Neophyte Logo" />
                    </div>
                  </>
                )}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
            // className=" "
            >
              <div
                className={`flex justify-center md:mt-0 mt-6 ${anchorEl ? `backdrop-blur-xl opacity-20 bg-gray-300` : ``
                  }`}

              >
                <TableContainer
                  className="w-auto max-w-[98%] shadow-lg rounded-lg overflow-hidden"
                  component={Paper}
                  sx={{
                    maxHeight: 700, // Set the fixed height (e.g., 400px)
                    overflowY: 'auto', // Enable vertical scrolling
                  }}
                >
                  <Table aria-label="product table">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#06B6D4" }}>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                          }}
                        >
                          EAN
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                          }}
                        >
                          Batch No
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                          }}
                        >
                          {/* Length&nbsp;(mm) */}
                          MRP
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                          }}
                        >
                          {/* Breadth&nbsp;(mm) */}
                          MFG
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                          }}
                        >
                          EXP
                        </TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData &&
                        tableData.map((result, index) => (
                          <TableRow
                            key={index}
                            onClick={() => handleRowClick(result)}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                border: 0,
                              },
                              "&:nth-of-type(odd)": {
                                backgroundColor: "#f5f5f5",
                              },
                              "&:hover": { backgroundColor: "#e3f2fd" },
                            }}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                              sx={{ fontSize: "1.5rem" }}
                            >
                              {result?.barcode}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                              sx={{ fontSize: "1.5rem" }}
                            >
                              {result?.batchNo}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontSize: "1.5rem" }}
                            >
                              {result?.mrp}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontSize: "1.5rem" }}
                            >
                              {result?.mfgDate}
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{ fontSize: "1.5rem" }}
                            >
                              {result?.expDate}
                            </TableCell>
                            {/* <TableCell
                                align="center"
                                sx={{ fontSize: "1rem" }}
                              >
                                {tab[3]}
                              </TableCell> */}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Dialog for editing */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                  <DialogTitle>Do you want to edit the metadata?</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      label="EAN"
                      name="barcode"
                      value={editedData.barcode || ""}
                      onChange={handleChange}
                      fullWidth
                      disabled
                    />
                    <TextField
                      margin="dense"
                      label="Batch No"
                      name="batchNo"
                      value={editedData.batchNo || ""}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      margin="dense"
                      label="MRP"
                      name="mrp"
                      value={editedData.mrp || ""}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      margin="dense"
                      label="MFG Date"
                      name="mfgDate"
                      value={editedData.mfgDate || ""}
                      onChange={handleChange}
                      fullWidth
                    />
                    <TextField
                      margin="dense"
                      label="EXP Date"
                      name="expDate"
                      value={editedData.expDate || ""}
                      onChange={handleChange}
                      fullWidth
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={handleOpenConfirmDialog} color="primary">
                      Save
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Confirmation Dialog */}
                <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                  <DialogTitle>Confirm Changes</DialogTitle>
                  <DialogContent>Are you sure you want to save these changes?</DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="secondary">
                      No
                    </Button>
                    <Button onClick={handleSaveChanges} color="primary">
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Grid>
            <WorkflowStatus statusUpdates={statusUpdates} />
          </Grid>
          {/* </div> */}
        </div>
      </div>


      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snackbarConfig.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarConfig({ ...snackbarConfig, open: false })}
      >
        <Alert
          onClose={() => setSnackbarConfig({ ...snackbarConfig, open: false })}
          severity={snackbarConfig.severity}
          sx={{ width: "100%" }}
        >
          {snackbarConfig.message}
        </Alert>
      </Snackbar>
    </>
  );
}
