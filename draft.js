const handleEnrollConfirm = async () => {
  try {
    setLoading(true); // Set loading to true while enrolling
    if (!selectedCourse) {
      // Check if selectedCourse is null
      throw new Error("No course selected for enrollment");
    }
    // Update the course status and send it to the backend
    const response = await axios.put(
      `${BASE_URL}/enroll/${selectedCourse.id}`,
      {
        status: "enrolled",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.data) {
      // After successful enrollment, fetch the updated course list
      fetchCourses();
      setErrorMessage(""); // Reset error message if there was any
      setOpen(false); // Close the enrollment dialog
    } else {
      setErrorMessage("Failed to enroll. Please try again.");
      // Show error message if enrollment failed
    }
  } catch (error) {
    setErrorMessage("Failed to enroll. Please try again.");
    console.error("Error enrolling in the course:", error);
  } finally {
    setLoading(false); // Set loading to false after enrollment attempt
  }
};
