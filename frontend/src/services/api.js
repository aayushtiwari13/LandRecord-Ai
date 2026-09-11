import axios from 'axios'; // Keeping for mock endpoints

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ==========================================
// 1. BACKEND DEV'S AUTH & TOKEN LOGIC
// ==========================================
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
  window.location.href = "/"; // Fixed to route back to your React login
};

// ==========================================
// 2. BACKEND DEV'S REAL API FETCH CALLS
// ==========================================
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

// ==========================================
// 3. THE FRONTEND ADAPTER (API SERVICE)
// React components will use this without breaking!
// ==========================================

const mockQueueData = [
  { id: "LR-8822-Y", khasra: "451/1", village: "Sitapur", issue: "Area Mismatch (0.2 Ac)", date: "2026-09-08 10:30 AM" },
  { id: "LR-8824-A", khasra: "12/4", village: "Karnal", issue: "Illegible Signature", date: "2026-09-08 11:15 AM" },
  { id: "LR-8826-C", khasra: "102", village: "Rohtak", issue: "Khata Not Found", date: "2026-09-08 01:45 PM" },
];

export const apiService = {
  
  // REAL API HOOKED UP: Upload -> Extract -> Return to React
  uploadDocument: async (formData) => {
    try {
      // 1. Get file from React's formData
      const file = formData.get("file");
      
      // 2. Call backend's real upload
      const uploadResponse = await uploadDocumentApi(file);
      
      // The backend will return an ID (e.g., uploadResponse.id or uploadResponse.document_id)
      const docId = uploadResponse.id || uploadResponse.document_id || 'LR-8822-Y';

      // 3. Call backend's AI Extract route
      try {
        await extractDocumentApi(docId);
      } catch (extractError) {
        console.warn("Real AI Extraction failed, but upload succeeded.", extractError);
      }

      // 4. Return in the format our React component expects
      return { data: { success: true, recordId: docId } };

    } catch (error) {
      console.error("Backend failed, falling back to mock UI...", error);
      // Fallback for Hackathon Demo if backend is down
      return new Promise((resolve) => {
        setTimeout(() => resolve({ data: { success: true, recordId: 'LR-8822-Y' } }), 2000);
      });
    }
  },

  // MOCK: Waiting for Backend Dev to provide Verification Queue JSON
  getPendingVerifications: async () => {
    try {
      // We can try to use his getMyDocumentsApi later, but keeping mock for now so UI doesn't break
      return new Promise((resolve) => setTimeout(() => resolve({ data: mockQueueData }), 1000));
    } catch (e) {
      return { data: mockQueueData };
    }
  },

  // MOCK: Waiting for Backend Dev
  getRecordById: async (recordId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: recordId, 
            documentType: "Khasra / Khatauni", language: "Hindi", uploadDate: "2026-09-08 10:24 AM",
            fields: [
              { key: "owner_name", label: "Owner / Entity", extracted: "Suresh Singh", confidence: 98.4, status: "high" },
              { key: "khasra_no", label: "Khasra Number", extracted: "451/1", confidence: 96.2, status: "high" },
              { key: "area", label: "Total Area (Acres)", extracted: "25.0", confidence: 61.2, status: "low", issue: "Mismatch: Expected 2.50" },
              { key: "village", label: "Village", extracted: "Sitapur", confidence: 99.1, status: "high" },
            ]
          }
        });
      }, 1000);
    });
  },

  // MOCK: Waiting for Backend Dev
  updateRecord: async (recordId, updatedData) => {
    return new Promise((resolve) => setTimeout(() => resolve({ data: { success: true } }), 1000));
  },

  // MOCK: Waiting for Backend Dev
  getDashboardStats: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            stats: [
              { title: "Processed Today", value: "1,248" },
              { title: "Auto-Validated", value: "1,102" },
              { title: "Pending Review", value: "146" },
              { title: "System Accuracy", value: "94.6%" },
            ],
            validationData: [{ name: 'Validated', value: 88, color: '#16a34a' }, { name: 'Review', value: 9, color: '#d97706' }, { name: 'Rejected', value: 3, color: '#dc2626' }],
            stateData: [{ state: 'DL', records: 820 }, { state: 'UP', records: 650 }, { state: 'HR', records: 430 }],
            recentRecords: [
              { id: "LR-8821-X", khasra: "125/2", owner: "Ramesh Kumar", confidence: 98.4, issue: "None", status: "Verified" },
              { id: "LR-8822-Y", khasra: "451/1", owner: "Suresh Singh", confidence: 61.2, issue: "Area Mismatch", status: "Review" },
            ]
          }
        });
      }, 1200);
    });
  },

  // MOCK: Login
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@gov.in' && credentials.password === 'password') {
          resolve({ data: { token: "mock_jwt_token_8821", user: { name: "Ashish Kumar", role: "Verifier Officer" } } });
        } else {
          reject({ response: { data: { message: "Invalid credentials." } } });
        }
      }, 1000);
    });
  }
};