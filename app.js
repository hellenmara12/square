const express = require("express");
require('dotenv').config();
const axios = require('axios');
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Express on Vercel"})
});

app.get('/api/invoice/search', async (req, res) => {
  const { email } = req?.query;
  // console.log(email, process.env);

  try {
    const response = await axios.get('https://connect.squareup.com/v2/invoices', {
      params: { location_id: `${process.env.LOCATION}` },
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${process.env.TOKEN}`
      }
    });
    // console.log(response);
    const invoices = response.data.invoices;
    const filteredInvoice = invoices.find(invoice => invoice?.primary_recipient?.email_address === email);

    // Send the response data back to the client
    if (!filteredInvoice) return res.status(404).json({ message: "Not found" });

    if (filteredInvoice) res.status(200).json(filteredInvoice);
  } catch (error) {
    console.error(error);
    // Send an error response back to the client
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;