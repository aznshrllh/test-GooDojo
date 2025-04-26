"use server";

import { baseUrl } from "@/helpers/baseUrl";
import {
  AddEmployeeSkillData,
  ApiError,
  CreateEmployeeData,
  Employee,
} from "../types";

// Employee actions
export async function getAllEmployees(): Promise<Employee[] | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees`, {
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
      message: `Failed to fetch employees: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getEmployeeById(
  id: number
): Promise<Employee | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees/${id}`, {
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
      message: `Failed to fetch employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createEmployee(
  data: CreateEmployeeData
): Promise<Employee | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees`, {
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
      message: `Failed to create employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updateEmployee(
  id: number,
  data: Partial<CreateEmployeeData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees/${id}`, {
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
      message: `Failed to update employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteEmployee(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees/${id}`, {
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
      message: `Failed to delete employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function addEmployeeSkill(
  data: AddEmployeeSkillData
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/employees/skills`, {
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
      message: `Failed to add skill to employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
