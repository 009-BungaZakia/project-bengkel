// admin.api.js
export const getAdminStats = async () => {
  try {
    const response = await axiosInstance.get("/stats"); 
    return response.data;
  } catch (error) {
   console.error("Detail 404:", error.config.url);
  }
};