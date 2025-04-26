"use server";

import { baseUrl } from "@/helpers/baseUrl";
import { ApiError, CreateDepartmentData, Department } from "../types";

// Department actions
export async function getAllDepartments(): Promise<Department[] | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/departments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to fetch departments: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getDepartmentById(
  id: number
): Promise<Department | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/departments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to fetch department: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createDepartment(
  data: CreateDepartmentData
): Promise<Department | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/departments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to create department: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updateDepartment(
  id: number,
  data: Partial<CreateDepartmentData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/departments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to update department: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteDepartment(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/departments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to delete department: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
