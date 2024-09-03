import React, { useState } from "react";
import axios from "axios";
import "../Style/Category.css";

function Strock() {
  const [particleImage, setParticleImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [strockData, setStrockData] = useState(null);

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
    setStrockData(null); // Clear previous result

    try {
      const formData = new FormData();
      if (particleImage) {
        // Convert base64 to a Blob
        const particleBlob = await fetch(particleImage).then((res) =>
          res.blob()
        );
        formData.append("image", particleBlob, "particleImage.jpg");

        const response = await axios.post(
          "http://127.0.0.1:8080/identify-stroke",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Assuming the response contains the `result_image` and `statistics`
        setStrockData(response.data);
      } else {
        console.error("No image provided.");
      }
    } catch (error) {
      console.error("Error submitting image:", error);
    } finally {
      setIsLoading(false);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleViewImage = () => {
    if (strockData && strockData.result_image) {
      const imageSrc = `data:image/jpeg;base64,${strockData.result_image}`;
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${imageSrc}" alt="Result Image" style="width:100%; height:100%; object-fit:contain;" />`;
    }
  };

  const isSubmitDisabled = !particleImage;

  return (
    <div className="category-container">
      <div className="c-header">Strock Analysis</div>

      <div className="c-inputs">
        <div className="input-feild">
          <label>Input Image:</label>
          <div className="input-image">
            <input
              type="file"
              name="particle"
              onChange={(e) => handleImageChange(e, setParticleImage)}
            />
            {particleImage && <img src={particleImage} alt="Particle" />}
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

      {showModal && strockData && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Results!</h1>
            {strockData.result_image && (
              <div>
                <h4>Result Image:</h4>
                <img
                  src={`data:image/jpeg;base64,${strockData.result_image}`}
                  alt="Result"
                  style={{ maxWidth: "100%" }}
                />
                <button
                  onClick={handleViewImage}
                  className="view-button"
                  onMouseDown={(e) => (e.target.style.backgroundColor = "red")}
                  onMouseUp={(e) => (e.target.style.backgroundColor = "blue")}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    padding: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    margin: "10px 0",
                  }}
                >
                  View Image
                </button>
              </div>
            )}
            {strockData.statistics && (
              <div>
                <h4>Analysis:</h4>
                <p>
                  Number of Brown Particles:{" "}
                  {strockData.statistics.number_of_brown_particles}
                </p>
                <p>
                  Number of Total Particles:{" "}
                  {strockData.statistics.number_of_external_contours}
                </p>
                <p>
                  Brown Particle Ratio:{" "}
                  {strockData.statistics.brown_particle_ratio.toFixed(2)}
                </p>
              </div>
            )}
            <button
              onClick={closeModal}
              className="close-button"
              onMouseDown={(e) => (e.target.style.backgroundColor = "red")}
              onMouseUp={(e) => (e.target.style.backgroundColor = "green")}
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Strock;
