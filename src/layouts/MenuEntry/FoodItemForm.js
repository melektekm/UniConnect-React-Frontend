import React from "react";
import MDBox from "../../components/MDBox";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";

    const FoodItemForm = ({
    values,
    errorMessages,
    loading,
    handleImageUpload,
    inputHandler,
    handleAddToMenu,
    selectedMenu,
    }) => {
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
    >
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Food Item Name"
          variant="outlined"
          fullWidth
          value={values.name}
          onChange={inputHandler}
          name="name"
        />
        {errorMessages.name && (
          <p style={{ color: "red" }}>{errorMessages.name}</p>
        )}
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="text"
          label="Description"
          variant="outlined"
          fullWidth
          value={values.description}
          onChange={inputHandler}
          name="description"
        />
      </MDBox>
      <MDBox mb={2}>
        <MDInput
          type="number"
          label="Price for Employee"
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
          label="Price for Guest"
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
          label="Meal type"
          onChange={inputHandler}
          name="meal_type"
          style={{
            width: "100%",
            padding: "8px", // Adjust the padding value as needed
          }}
        >
          <option value="lunch">Lunch</option>
          <option value="breakfast">Breakfast</option>
          <option value="drink">Drink</option>
        </select>
      </MDBox>
      <MDBox mb={2}>
        <select
          value={values.is_fasting}
          onChange={inputHandler}
          name="is_fasting"
          style={{
            width: "100%",
            padding: "8px", // Adjust the padding value as needed
          }}
        >
          <option value={1}>Fasting</option>
          <option value={0}>Non-Fasting</option>
        </select>
      </MDBox>
      <MDBox mb={2}>
        <label htmlFor="imageUpload">Upload Image:</label>
        <MDInput
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          name="imageUrl"
        />
        {errorMessages.imageUrl && (
          <p style={{ color: "red" }}>{errorMessages.imageUrl}</p>
        )}
      </MDBox>
      <div style={{ textAlign: "center" }}>
        <MDButton
          variant="gradient"
          color="info"
          onClick={handleAddToMenu}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Adding..." : selectedMenu ? "Update Menu" : "Add to Menu"}
        </MDButton>
      </div>
    </MDBox>
  );
};

export default FoodItemForm;
