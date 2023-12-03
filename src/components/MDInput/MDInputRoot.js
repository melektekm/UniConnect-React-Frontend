// @mui material components
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export default styled(TextField)(({ theme, ownerState }) => {
  const { palette, functions } = theme;
  const { error, success, disabled } = ownerState;

  const {
    grey,
    transparent,
    error: colorError,
    success: colorSuccess,
  } = palette;
  const { pxToRem } = functions;

  // styles for the input with error={true}
  const errorStyles = () => ({
    // existing error styles...

    borderRadius: pxToRem(30), // Add rounded border radius
  });

  // styles for the input with success={true}
  const successStyles = () => ({
    // existing success styles...

    borderRadius: pxToRem(30), // Add rounded border radius
  });

  return {
    backgroundColor: disabled ? `${grey[200]} !important` : transparent.main,
    pointerEvents: disabled ? "none" : "auto",
    ...(error && errorStyles()),
    ...(success && successStyles()),
    borderRadius: pxToRem(300), // Add rounded border radius for normal input fields
  };
});
