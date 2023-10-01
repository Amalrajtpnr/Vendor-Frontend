import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const getProducts = async () => {
    try {
      fetch("http://localhost:5000/api/vendor", {
        headers: {
          method: "GET",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setVendors(data);
          console.log(process.env.REACT_APP_API_KEY); 
        });
    } catch (error) {
      console.log("failed");
    }
  };

  useEffect(() => {
    // Simulate fetching vendor data from the backend
    getProducts();
  }, []);

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditing(false);
  };

  const handleEditVendor = () => {
    setIsEditing(true);
  };

  const handleConfirmVendor = () => {
    fetch(`http://localhost:5000/api/vendors/${selectedVendor._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedVendor),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Vendor updated:", data);
        const updatedVendors = vendors.map((v) =>
          v._id === data._id ? data : v
        );
        setVendors(updatedVendors);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleDeleteVendor = () => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      // Send a DELETE request to your backend API
      fetch(`http://localhost:5000/api/vendors/${selectedVendor._id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          window.location.reload();
         
        })
        .catch((error) => {
          console.error("Delete error:", error);
        });
    }
  };
  

  return (
    <div className="vendor-management">
      <div className="vendor-list">
        <h2>List of Vendors</h2>
        <ul>
          {vendors.map((vendor) => (
            <li
            key={vendor.id}
            onClick={() => {
              handleSelectVendor(vendor);
            }}
            className={
              setVendors.id === vendor.id ? 'selected' : 'unselected'
            }
      
            >
              {vendor.vendorName}
            </li>
          ))}
        </ul>
      </div>

      <div className="vendor-details">
        <h2>Vendor Details</h2>
        {isEditing ? (
          <div>
            <input
              type="text"
              placeholder="Vendor Name"
              value={selectedVendor.vendorName}
              onChange={(e) =>
                setSelectedVendor({
                  ...selectedVendor,
                  vendorName: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Bank Account No."
              value={selectedVendor.bankAccountNo}
              onChange={(e) =>
                setSelectedVendor({
                  ...selectedVendor,
                  bankAccountNo: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Bank Name"
              value={selectedVendor.bankName}
              onChange={(e) =>
                setSelectedVendor({
                  ...selectedVendor,
                  bankName: e.target.value,
                })
              }
            />
            <button onClick={handleConfirmVendor}>Save</button>
          </div>
        ) : (
          <div>
            <p>Vendor Name: {selectedVendor.vendorName}</p>
            <p>Bank Account No.: {selectedVendor.bankAccountNo}</p>
            <p>Bank Name: {selectedVendor.bankName}</p>
            <div className="buttons">
            <button onClick={handleEditVendor}>Edit</button>
            <button  onClick={handleDeleteVendor}>Confirm</button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
