import React, { useState } from "react";
import axios from "axios";
import "../Style/Category.css";

function Category() {
  const [particleImage, setParticleImage] = useState("");
  const [liquidImage, setLiquidImage] = useState("");
  const [infusionImage, setInfusionImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [responses, setResponses] = useState([]);

  const handleImageChange = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponses([]); // Clear previous responses

    const requests = [];

    if (particleImage) {
      const particleBlob = await fetch(particleImage).then(res => res.blob());
      const particleFormData = new FormData();
      particleFormData.append('image', particleBlob, 'particleImage.jpg');
      requests.push(
        axios.post("http://127.0.0.1:8080/predict-tea-variant", particleFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => ({
          type: 'Tea Category:',
          data: response.data.tea_variant
        }))
      );
    }

    if (liquidImage) {
      const liquidBlob = await fetch(liquidImage).then(res => res.blob());
      const liquidFormData = new FormData();
      liquidFormData.append('image', liquidBlob, 'liquidImage.jpg');
      requests.push(
        axios.post("http://127.0.0.1:8080/predict", liquidFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => ({
          type: 'Elevation(Liquid):',
          data: response.data.tea_elevation
        }))
      );
    }

    if (infusionImage) {
      const infusionBlob = await fetch(infusionImage).then(res => res.blob());
      const infusionFormData = new FormData();
      infusionFormData.append('image', infusionBlob, 'infusionImage.jpg');
      requests.push(
        axios.post("http://127.0.0.1:8080/predict-infusion", infusionFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => ({
          type: 'Elevation(Infusion):',
          data: response.data.tea_elevation
        }))
      );
    }

    try {
      const results = await Promise.all(requests);
      setResponses(results);
      setShowModal(true);
    } catch (error) {
      console.error("Error submitting images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const isSubmitDisabled = !(particleImage || liquidImage || infusionImage);

  return (
    <div className="category-container">
      <div className="c-header">Category Analysis</div>
      <div className="c-inputs">
        <div className="input-feild">
          <label>Add Particle Image:</label>
          <div className="input-image">
            <input
              type="file"
              name="particle"
              onChange={(e) => handleImageChange(e, setParticleImage)}
            />
            {particleImage && <img src={particleImage} alt="Particle" />}
          </div>
        </div>
        <div className="input-feild">
          <label>Add Liquid Image:</label>
          <div className="input-image">
            <input
              type="file"
              name="liquid"
              onChange={(e) => handleImageChange(e, setLiquidImage)}
            />
            {liquidImage && <img src={liquidImage} alt="Liquid" />}
          </div>
        </div>
        <div className="input-feild">
          <label>Add Infusion Image:</label>
          <div className="input-image">
            <input
              type="file"
              name="infusion"
              onChange={(e) => handleImageChange(e, setInfusionImage)}
            />
            {infusionImage && <img src={infusionImage} alt="Infusion" />}
          </div>
        </div>
      </div>
      <button
        className="submit-button"
        disabled={isSubmitDisabled || isLoading}
        onClick={handleSubmit}
        style={
          isSubmitDisabled || isLoading
            ? { backgroundColor: "gray", color: "darkgray" }
            : { backgroundColor: "green" }
        }
      >
        {isLoading ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="spinner" style={{ marginRight: "10px" }}></div>
            Processing...
          </div>
        ) : (
          "Submit"
        )}
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Results!</h1>
            {responses.map((response, index) => (
              <div key={index}>
                <h4>{response.type}</h4>
                <p>{response.data}</p>
              </div>
            ))}
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Category;
