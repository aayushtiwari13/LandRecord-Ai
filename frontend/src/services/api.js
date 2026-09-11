const BASE_URL = "http://127.0.0.1:8000";


// Token handling (Dost ke 'auth_token' key ke sath synchronize kiya)
export const getAuthToken = () => {
  return localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
};

export const setAuthToken = (token) => {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("token", token);
};

export const logoutUser = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// 1. Upload File
export async function uploadDocumentApi(file) {
  const formData = new FormData();
  formData.append("file", file);

  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "File upload failed");
  }
  return await res.json();
}

// 2. Extract Document (AI Trigger)
export async function extractDocumentApi(documentId) {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/upload/${documentId}/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "AI Extraction failed");
  }
  return await res.json();
}

// 3. Get User Documents
export async function getMyDocumentsApi() {
  const token = getAuthToken();
  const res = await fetch(`${BASE_URL}/upload/my-documents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch documents");
  }
  return await res.json();
}