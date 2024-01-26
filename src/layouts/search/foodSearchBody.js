{
  foodMenu.length === 0 ? (
    <Typography variant="h6" align="center">
      ምንም ሜኑ አልተገኘም።
    </Typography>
  ) : (
    <Grid container spacing={6}>
      {foodMenu.map((foodItem) => (
        <Grid item xs={12} sm={6} md={4} key={foodItem.id}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="dark"
              borderRadius="lg"
              coloredShadow="info"
            >
              <MDTypography variant="h4" color="white">
                {foodItem.name}
              </MDTypography>
              <MDTypography variant="h6" color="white">
                {foodItem.meal_type}
              </MDTypography>
            </MDBox>
            <MDBox pt={3} pb={3} px={2}>
              <img
                src={foodItem.image_url}
                alt={foodItem.name}
                style={{ width: "100%", height: "auto" }}
              />
              <MDTypography variant="body1">
                {foodItem.description}
              </MDTypography>
              <MDTypography variant="body2">
                የሰራተኛ ዋጋ: {foodItem.price_for_employee} | የእንግዳ ዋጋ፡:
                {foodItem.price_for_guest}
              </MDTypography>
              <MDBox display="flex" alignItems="center" mt={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={foodItem.is_drink === 1}
                      color="primary"
                      onChange={() => handleMenuSelect(foodItem.id)}
                    />
                  }
                  label="መጠጥ ነው"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={foodItem.is_fasting}
                      color="primary"
                      onChange={() => handleMenuSelect(foodItem.id)}
                    />
                  }
                  label="ጾም ነው"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={foodItem.available && selectedAvailability}
                      color="primary"
                      onChange={() => handleMenuSelect(foodItem.id)}
                    />
                  }
                  label="የሚገኝ"
                />
              </MDBox>

              <Segment clearing basic>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => {
                    handleUpdateMenu(foodItem);
                  }}
                  style={{ marginRight: "15px" }}
                >
                  አስተካክል
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={() => handleDeleteMenu(foodItem.id)}
                  style={{ marginLeft: "30px" }}
                >
                  ሰርዝ
                </MDButton>
              </Segment>
            </MDBox>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
