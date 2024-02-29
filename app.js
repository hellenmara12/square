const express = require("express");
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');
const app = express();



// Use cors middleware to allow CORS on all sites.
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Express on Vercel" })
});

// app.get('/api/invoice/search', async (req, res) => {
//   const { email } = req?.query
//   // console.log(email, process.env);

//   try {
//     const response = await axios.get('https://connect.squareup.com/v2/invoices', {
//       params: { location_id: `${process.env.LOCATION}` },
//       headers: {
//         Accept: '*/*',
//         Authorization: `Bearer ${process.env.TOKEN}`
//       }
//     });
//     // console.log(response);
//     const invoices = response.data.invoices;
//     const filteredInvoice = invoices.find(invoice => invoice?.primary_recipient?.email_address === email);

//     // Send the response data back to the client
//     if (!filteredInvoice) return res.status(404).json({ message: "Not found" });

//     if (filteredInvoice) res.status(200).json(filteredInvoice);
//   } catch (error) {
//     console.error(error);
//     // Send an error response back to the client
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


// app.get('/api/invoice/search', async (req, res) => {
//   const { email } = req.query;
//   console.log(email);
//   let allInvoices = []; // Array to store all fetched invoices

//   try {
//     let cursor = null;

//     do {
//       const response = await axios.get('https://connect.squareup.com/v2/invoices', {
//         params: {
//           location_id: `${process.env.LOCATION}`,
//           cursor: cursor // Include cursor in request params
//         },
//         headers: {
//           Accept: '*/*',
//           Authorization: `Bearer ${process.env.TOKEN}`
//         }
//       });

//       const invoices = response.data.invoices;
//       allInvoices = allInvoices.concat(invoices); // Add fetched invoices to the array

//       // Check if there's a next page
//       if (response.data.cursor) {
//         cursor = response.data.cursor;
//       } else {
//         cursor = null; // Set cursor to null to exit the loop
//       }
//     } while (cursor);

//     // Filter invoices by email
//     const filteredInvoice = allInvoices.find(invoice => invoice?.primary_recipient?.email_address === email);

//     if (!filteredInvoice) return res.status(404).json({ message: "Not found" });

//     res.status(200).json(filteredInvoice);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


app.get('/api/invoice/search', async (req, res) => {
  const { email } = req.query;
  let allInvoices = []; // Array to store all fetched invoices
  let foundInvoice = null; // Variable to store the found invoice

  try {
    let cursor = null;

    do {
      const response = await axios.get('https://connect.squareup.com/v2/invoices', {
        params: {
          location_id: `${process.env.LOCATION}`,
          cursor: cursor // Include cursor in request params
        },
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${process.env.TOKEN}`
        }
      });

      const invoices = response.data.invoices;
      allInvoices = allInvoices.concat(invoices); // Add fetched invoices to the array

      // Check if the result is found in the current batch of invoices
      foundInvoice = invoices.find(invoice => invoice?.primary_recipient?.email_address === email);
      if (foundInvoice) break; // Break out of the loop if the result is found

      // Check if there's a next page
      if (response.data.cursor) {
        cursor = response.data.cursor;
      } else {
        cursor = null; // Set cursor to null to exit the loop
      }
    } while (cursor && !foundInvoice); // Continue loop until no cursor or result is found

    // Send the response data back to the client
    if (!foundInvoice) return res.status(404).json({ message: "Not found" });

    res.status(200).json(foundInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;