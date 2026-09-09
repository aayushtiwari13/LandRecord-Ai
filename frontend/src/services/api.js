import axios from 'axios';

// Backend URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Data for the Queue
const mockQueueData = [
  { id: "LR-8822-Y", khasra: "451/1", village: "Sitapur", issue: "Area Mismatch (0.2 Ac)", date: "2026-09-08 10:30 AM" },
  { id: "LR-8824-A", khasra: "12/4", village: "Karnal", issue: "Illegible Signature", date: "2026-09-08 11:15 AM" },
  { id: "LR-8826-C", khasra: "102", village: "Rohtak", issue: "Khata Not Found", date: "2026-09-08 01:45 PM" },
];

export const apiService = {
  // 1. Upload Document API
  uploadDocument: async (formData) => {
    console.log("Mocking upload for document...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, recordId: 'LR-8822-Y', message: 'Processing complete' } });
      }, 2000);
    });
  },

  // 2. Fetch Verification Queue
  getPendingVerifications: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockQueueData });
      }, 1500); 
    });
  },

  // 3. Fetch Details for a Specific Record
  getRecordById: async (recordId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: recordId, 
            documentType: "Khasra / Khatauni",
            language: "Hindi",
            uploadDate: "2026-09-08 10:24 AM",
            fields: [
              { key: "owner_name", label: "Owner / Entity", extracted: "Suresh Singh", confidence: 98.4, status: "high" },
              { key: "khasra_no", label: "Khasra Number", extracted: "451/1", confidence: 96.2, status: "high" },
              { key: "khata_no", label: "Khata Number", extracted: "112", confidence: 91.0, status: "high" },
              { key: "area", label: "Total Area (Acres)", extracted: "25.0", confidence: 61.2, status: "low", issue: "DILRMP Mismatch: Expected 2.50" },
              { key: "village", label: "Village", extracted: "Sitapur", confidence: 99.1, status: "high" },
            ]
          }
        });
      }, 1000);
    });
  },

  // 4. Update/Commit Record to Database
  updateRecord: async (recordId, updatedData) => {
    console.log("Saving data for", recordId, ":", updatedData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { success: true, message: "Record verified and saved successfully!" } });
      }, 1500);
    });
  },

  // 5. Fetch Dashboard Telemetry
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
            validationData: [
              { name: 'Auto-Validated', value: 88, color: '#16a34a' },
              { name: 'Needs Review', value: 9, color: '#d97706' },
              { name: 'Rejected', value: 3, color: '#dc2626' },
            ],
            stateData: [
              { state: 'DL', records: 820 },
              { state: 'UP', records: 650 },
              { state: 'HR', records: 430 },
              { state: 'RJ', records: 310 },
            ],
            recentRecords: [
              { id: "LR-8821-X", khasra: "125/2", owner: "Ramesh Kumar", confidence: 98.4, issue: "None", status: "Verified" },
              { id: "LR-8822-Y", khasra: "451/1", owner: "Suresh Singh", confidence: 61.2, issue: "Area Mismatch", status: "Review" },
              { id: "LR-8826-C", khasra: "102", owner: "Vikram Singh", confidence: 21.0, issue: "Khata Not Found", status: "Critical" },
            ]
          }
        });
      }, 1200);
    });
  },

  // 6. Authentication (Mock JWT Login)
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === 'admin@gov.in' && credentials.password === 'password') {
          resolve({ 
            data: { 
              token: "mock_jwt_token_8821", 
              user: { name: "Ashish Kumar", role: "Verifier Officer" } 
            } 
          });
        } else {
          reject({ response: { data: { message: "Invalid credentials. Please use authorized government ID." } } });
        }
      }, 1000);
    });
  }
};