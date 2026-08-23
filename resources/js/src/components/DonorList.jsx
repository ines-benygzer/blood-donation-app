import React, { useEffect, useState } from "react";
import api from "../api/axios";

function DonorList() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    api.get("/donors")
      .then(response => setDonors(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Donors</h2>
      <ul>
        {donors.map(donor => (
          <li key={donor.id}>{donor.name} - {donor.blood_type}</li>
        ))}
      </ul>
    </div>
  );
}

export default DonorList;
