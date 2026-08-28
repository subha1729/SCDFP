// ============================================================
// SCDFP FRONTEND API SERVICE
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";


// ============================================================
// GENERIC API REQUEST
// ============================================================

async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          ...(options.body instanceof FormData
            ? {}
            : {
                "Content-Type": "application/json",
              }),

          ...(options.headers || {}),
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Something went wrong";

      try {
        const errorData = await response.json();

        errorMessage =
          errorData.message ||
          errorData.error ||
          errorMessage;
      } catch {
        // Backend did not return JSON.
      }

      throw new Error(errorMessage);
    }

    return await response.json();

  } catch (error) {

    console.error(
      `API Error [${endpoint}]:`,
      error
    );

    throw error;
  }
}


// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkBackendHealth() {
  return apiRequest("/health");
}


// ============================================================
// DATA UPLOAD
// ============================================================
//
// Files:
//   sales_history.csv
//   holidays.csv
//   future_promotions.csv (optional)
//

export async function uploadData({
  salesHistory,
  holidays,
  promotions = null,
}) {

  const formData = new FormData();

  if (salesHistory) {
    formData.append(
      "sales_history",
      salesHistory
    );
  }

  if (holidays) {
    formData.append(
      "holidays",
      holidays
    );
  }

  if (promotions) {
    formData.append(
      "future_promotions",
      promotions
    );
  }

  return apiRequest("/upload", {
    method: "POST",
    body: formData,
  });
}


// ============================================================
// FORECASTING
// ============================================================

export async function generateForecast({
  days = 7,
  storeId = null,
}) {

  return apiRequest("/forecast", {
    method: "POST",

    body: JSON.stringify({
      days,
      storeId,
    }),
  });
}


// ============================================================
// GET SAVED FORECAST
// ============================================================

export async function getForecast() {
  return apiRequest("/forecast");
}


// ============================================================
// EVALUATION
// ============================================================

export async function getEvaluation() {
  return apiRequest("/evaluation");
}


// ============================================================
// STORE CLUSTERING
// ============================================================

export async function getClusters() {
  return apiRequest("/clustering");
}


// ============================================================
// INVENTORY
// ============================================================

export async function getInventory() {
  return apiRequest("/inventory");
}


// ============================================================
// PURCHASE ORDER RECOMMENDATIONS
// ============================================================

export async function getPurchaseOrders() {
  return apiRequest("/purchase-orders");
}


// ============================================================
// REPORTS
// ============================================================

export async function getReports() {
  return apiRequest("/reports");
}


// ============================================================
// DEFAULT API OBJECT
// ============================================================
//
// Optional convenience export.
// You can use either:
//
// import { getClusters } from "../services/api";
//
// OR:
//
// import api from "../services/api";
// api.getClusters();
//

const api = {
  checkBackendHealth,
  uploadData,
  generateForecast,
  getForecast,
  getEvaluation,
  getClusters,
  getInventory,
  getPurchaseOrders,
  getReports,
};

export default api;