import React from "react";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import MDTypography from "../../components/MDTypography";
import colors from "../../assets/theme/base/colors";
const FoodItemForm = ({
  values,
  errorMessages,
  loading,
  handleImageUpload,
  inputHandler,
  handleAddToMenu,
   selectedMenu,
  file,
}) => {
  const lettersOnlyRegex = /^[\u1200-\u137F\s]*$/;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // if (name === "name" || name === "description") {
    //   if (value === "" || lettersOnlyRegex.test(value)) {
    //     // Only update the state if the input is empty or contains only letters
    //     inputHandler(e);
    //   }
    // } else {
    // Update the state directly for other fields
    inputHandler(e);
    // }
  };
  const fileInputStyle = {
    display: "inline-block",
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: colors.dark.main, 
    color: "white",
    borderRadius: "5px",
    border: "1px solid #007bff",
    zIndex: 1000


  };
  return (
    <MDBox
      variant="gradient"
      borderRadius="lg"
      coloredShadow="success"
      mx={2}
      px={2}
      py={2}
      component="form"
      role="form"
      style={{ border: "3px solid #206A5D" }}
    >
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="የምግብ ስም"
          variant="outlined"
          fullWidth
          value={values.name}
          onChange={handleInputChange}
          name="name"
        />
        {errorMessages.name && (
          <p style={{ color: "red" }}>{errorMessages.name}</p>
        )}
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="መግለጫ"
          variant="outlined"
          fullWidth
          value={values.description}
          onChange={handleInputChange}
          name="description"
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="number"
          label="የሰራተኛ ዋጋ"
          variant="outlined"
          fullWidth
          value={values.price_for_employee}
          onChange={inputHandler}
          name="price_for_employee"
        />
        {errorMessages.price_for_employee && (
          <p style={{ color: "red" }}>{errorMessages.price_for_employee}</p>
        )}
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="number"
          label="ለእንግዳ ዋጋ"
          variant="outlined"
          fullWidth
          value={values.price_for_guest}
          onChange={inputHandler}
          name="price_for_guest"
        />
        {errorMessages.price_for_guest && (
          <p style={{ color: "red" }}>{errorMessages.price_for_guest}</p>
        )}
      </MDBox>
      <MDBox mb={2}>
        <select
          value={values.meal_type}
          label="የምግብ አይነት"
          onChange={inputHandler}
          name="meal_type"
          style={{
            width: "100%",
            padding: "8px", // Adjust the padding value as needed
          }}
        >
          <option value="lunch">ምሳ</option>
          <option value="breakfast">ቁርስ</option>
          <option value="drink">መጠጥ</option>
        </select>
      </MDBox>
      <MDBox mb={2}>
        <select
          value={values.is_fasting ? "1" : "0"}
          onChange={inputHandler}
          name="is_fasting"
          style={{
            width: "100%",
            padding: "8px", // Adjust the padding value as needed
          }}
        >
          <option value="1">የጾም</option>
          <option value="0">የፍስክ </option>
        </select>
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="number"
          label="የሚገኝ መጠን"
          variant="outlined"
          fullWidth
          value={values.available_amount}
          onChange={inputHandler}
          name="available_amount"
        />
      </MDBox>
     
      <MDBox mb={2} style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="imageUpload" style={fileInputStyle}>
    <input
      type="file"
      id="imageUpload"
      accept="image/*"
      name="imageUrl"
      onChange={handleImageUpload} 
      style={{ display: "none" }}
    />
    <span>&#128206; {file ? file.name : "የፎቶ ማስገቢያ:"}</span>
  </label>
  <MDTypography variant="body2" ml={1}>
    ከ 1 MB ያልበለጠ ፤  jpeg, jpg, png
  </MDTypography>
</MDBox>
      <div style={{ textAlign: "center" }}>
        <MDButton
          variant="contained"
          color="primary"
          style={{ border: "3px solid #07689F" }}
          onClick={handleAddToMenu}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "በሒደት ላይ..." : selectedMenu ? "ሜኑን ቀይር" : "ወደ ሜኑ አስገባ"}
        </MDButton>
      </div>
    </MDBox>
  );
};

export default FoodItemForm;
