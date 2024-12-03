// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import axios from "axios"
// import {
//   Grid,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Card,
//   CardContent,
//   Button,
// } from "@mui/material";
// import DownloadIcon from "@mui/icons-material/Download";

// function Home() {
//   const [socket, setSocket] = useState(null);
//   const [product,setproduct] = useState(null);
//   const [allproduct,setallproduct] = useState(null);

//   const setupSocket = () => {
//     if (!socket) {
//       const newSocket = io("http://localhost:5000");

//       newSocket.on("disconnect", () => {
//         setSocket(null);
//         setTimeout(setupSocket, 3000);
//       });

//       newSocket.on("connect", () => {
//         console.log("success", "Socket Connected!");
//       });

//       setSocket(newSocket);
//     }
//   };
//   const getprod = async()=>{
//     try{const response = await fetch("http://localhost:5000/product", {withCredentials: true})
//     const allprod = await response.json();
//     console.log(allprod);
//     allprod && allprod.reverse();
//     setallproduct(allprod);

// }
//     catch(e){console.log(e)}
//   }
//   useEffect(() => {
//     setupSocket();
//     getprod();
// }, []);
// useEffect(() => {
//     setupSocket();
//     getprod();
// }, [product]);

// socket &&
// socket.on("singleproduct", (productfrombackend) => {
//   console.log(productfrombackend);
//   setproduct(productfrombackend);
// });

//   const realtimedata = {
//     // data coming through socket.io
//     EAN: "1234567890123",
//     L: "10 cm",
//     B: "5 cm",
//     H: "15 cm",
//     Wt: "0.5 kg",
//   };

//   function createData(EAN, L, B, H, Wt) {
//     return { EAN, L, B, H, Wt };
//   }

//   const initialData = [
//     // pushing into a array when new object comes
//     createData("12123213123", 159, 6.0, 24, 4.0),
//     createData("12312321465", 237, 9.0, 37, 4.3),
//     createData("29979504834", 262, 16.0, 24, 6.0),
//     createData("48937920842", 305, 3.7, 67, 4.3),
//     createData("424297898093", 356, 16.0, 49, 3.9),
//   ];

//   // const [tableData, setTableData] = useState(false);

//   // useEffect(() => {
//   //   // Update serial numbers
//   //   const updatedData = initialData.map((item, index) => ({
//   //     Sl_No: index + 1,
//   //     ...item
//   //   }));
//   //   setTableData(updatedData);
//   // }, []);

//   return (
//     <>
//       <div className="py-4">
//         <Grid
//           container
//           spacing={1}
//           sx={{ padding: 2, display: "flex", justifyContent: "center" }}
//         >
//           <Grid
//             item
//             xs={12}
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//             marginBottom={5}

//           >
//             <Typography variant="h4" gutterBottom>
//               Current Product Details
//             </Typography>
//             <Button variant="contained" startIcon={<DownloadIcon />}  sx={{height: "3.4rem", width: "10.4rem"}}>
//               Download
//             </Button>
//           </Grid>

//           <Grid item xs={4} md={4}>
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "6rem",
//                 display: "flex",
//                 //  flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "1.5rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 Length:
//               </Typography>

//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "2.0rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 { product ? product.length : "__"}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={4} md={4}>
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "6rem",
//                 display: "flex",
//                 // flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "1.5rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 Breadth:
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "2.0rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 { product ?  product.breadth : "__"}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={4} md={4}>
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "6rem",
//                 display: "flex",
//                 // flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "1.5rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 Heigth :
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "2.0rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 {  product ?  product.heigth : "__"}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={6} md={6} sx={{ marginTop: "1rem" }}>
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "6rem",
//                 display: "flex",
//                 //  flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "1.5rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 EAN:
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "2.0rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 { product ? product.ean_number : '__'}
//               </Typography>
//             </Card>
//           </Grid>
//           <Grid item xs={6} md={6} sx={{ marginTop: "1rem" }}>
//             <Card
//               variant="outlined"
//               sx={{
//                 height: "6rem",
//                 display: "flex",
//                 // flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "1.5rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 Weight:
//               </Typography>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontSize: "2rem", marginBottom: 1 }}
//                 className="text-center"
//               >
//                 { product ? product.weigth : "__"}
//               </Typography>
//             </Card>
//           </Grid>
//         </Grid>
//       </div>

//       <div className="flex justify-center">
//         <TableContainer
//           className="w-auto max-w-[98%] shadow-lg rounded-lg overflow-hidden"
//           component={Paper}
//         >
//           <Table sx={{ minWidth: 650 }} aria-label="product table">
//             <TableHead>
//               <TableRow sx={{ bgcolor: "#06B6D4" }}>
//                 <TableCell
//                   sx={{ color: "white", fontWeight: "bold", fontSize: "2rem" }}
//                 >
//                   EAN
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: "white",
//                     fontWeight: "bold",
//                     fontSize: "1.6rem",
//                   }}
//                 >
//                   Length&nbsp;(cm)
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: "white",
//                     fontWeight: "bold",
//                     fontSize: "1.6rem",
//                   }}
//                 >
//                   Breadth&nbsp;(cm)
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: "white",
//                     fontWeight: "bold",
//                     fontSize: "1.6rem",
//                   }}
//                 >
//                   Height&nbsp;(cm)
//                 </TableCell>
//                 <TableCell
//                   align="right"
//                   sx={{
//                     color: "white",
//                     fontWeight: "bold",
//                     fontSize: "1.6rem",
//                   }}
//                 >
//                   Weight&nbsp;(Kg)
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {allproduct && allproduct.map((tab, index) => (
//                 <TableRow
//                   key={tab.EAN}
//                   sx={{
//                     "&:last-child td, &:last-child th": { border: 0 },
//                     "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" },
//                     "&:hover": { backgroundColor: "#e3f2fd" },
//                   }}
//                 >
//                   <TableCell
//                     component="th"
//                     scope="row"
//                     sx={{ fontSize: "1.2rem" }}
//                   >
//                     {tab.ean_number}
//                   </TableCell>
//                   <TableCell align="right" sx={{ fontSize: "1.2rem" }}>
//                     {tab.length}
//                   </TableCell>
//                   <TableCell align="right" sx={{ fontSize: "1.2rem" }}>
//                     {tab.breadth}
//                   </TableCell>
//                   <TableCell align="right" sx={{ fontSize: "1.2rem" }}>
//                     {tab.heigth}
//                   </TableCell>
//                   <TableCell align="right" sx={{ fontSize: "1.2rem" }}>
//                     {tab.weigth}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     </>
//   );
// }

// export default Home;
