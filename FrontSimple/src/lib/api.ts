import { User, UsersResponse, CreateUserData } from "@/types/user";

const API_BASE_URL = "http://localhost:5000/api/users";

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(`API Error: ${response.statusText}`, response.status);
  }
  return response.json();
}

export const api = {
  // Get paginated users
  async getUsers(pageNumber: number = 1, pageSize: number = 10): Promise<UsersResponse> {
    const url = `${API_BASE_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await fetch(url);
    return handleResponse<UsersResponse>(response);
  },

  // Get single user by ID
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse<User>(response);
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  // Update user
  async updateUser(id: string, userData: Partial<CreateUserData>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new ApiError(`Failed to delete user: ${response.statusText}`, response.status);
    }
  },

  // Generate users
  async generateUsers(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
    });
    if (!response.ok) {
      throw new ApiError(`Failed to generate users: ${response.statusText}`, response.status);
    }
  },

  // Export CSV
  async exportCSV(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/relatorio-csv`);
    if (!response.ok) {
      throw new ApiError(`Failed to export CSV: ${response.statusText}`, response.status);
    }
    return response.blob();
  },

  // Export PDF
  async exportPDF(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/relatorio-pdf`);
    if (!response.ok) {
      throw new ApiError(`Failed to export PDF: ${response.statusText}`, response.status);
    }
    return response.blob();
  },
};