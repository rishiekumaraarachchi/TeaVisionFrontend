import React, { useState } from "react";
import axios from "axios";
import "../Style/Category.css";

function Fiber() {
  const [particleImage, setParticleImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fiberData, setFiberData] = useState(null);

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
    setFiberData(null); // Clear previous result

    try {
      const formData = new FormData();
      if (particleImage) {
        // Convert base64 to a Blob
        const particleBlob = await fetch(particleImage).then((res) =>
          res.blob()
        );
        formData.append("image", particleBlob, "particleImage.jpg");

        const response = await axios.post(
          "http://127.0.0.1:8080/identify-fiber?image",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        // Assuming the response contains the `result_image` and `statistics`
        setFiberData(response.data);
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
    if (fiberData && fiberData.result_image) {
      const imageSrc = `data:image/jpeg;base64,${fiberData.result_image}`;
      const newTab = window.open();
      newTab.document.body.innerHTML = `<img src="${imageSrc}" alt="Result Image" style="width:100%; height:100%; object-fit:contain;" />`;
    }
  };

  const isSubmitDisabled = !particleImage;

  return (
    <div className="category-container">
      <div className="c-header">Fiber Analysis</div>

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

      {showModal && fiberData && (
        <div className="modal-overlay">
          <div className="modal">
            <h1>Results!</h1>
            {fiberData.result_image && (
              <div>
                <h4>Exracted Fibers:</h4>
                <img
                  src={`data:image/jpeg;base64,${fiberData.result_image}`}
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
            {fiberData.statistics && (
              <div>
                <h4>Analysis:</h4>
                
                <p>
                  Number of Fiber Particles:{" "}
                  {fiberData.statistics.number_of_thin_particles}
                </p>
                <p>
                  Total Number of Particles:{" "}
                  {fiberData.statistics.total_number_of_particles}
                </p>
                <p>
                  Average Ratio of Fibers:{" "}
                  {fiberData.statistics.average_ratio_thin_to_total.toFixed(2)}
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

export default Fiber;
