"use server";

import { baseUrl } from "@/helpers/baseUrl";
import {
  ApiError,
  CreatePerformanceData,
  Performance,
  PerformanceWithEmployee,
} from "../types";

// Performance actions
export async function getAllPerformances(): Promise<
  PerformanceWithEmployee[] | ApiError
> {
  try {
    const response = await fetch(`${baseUrl}/performances`, {
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
      message: `Failed to fetch performances: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getPerformanceById(
  id: number
): Promise<PerformanceWithEmployee | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/performances/${id}`, {
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
      message: `Failed to fetch performance: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getPerformancesByEmployeeId(
  employeeId: number
): Promise<PerformanceWithEmployee[] | ApiError> {
  try {
    const response = await fetch(
      `${baseUrl}/performances/employee/${employeeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to fetch performances for employee: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createPerformance(
  data: CreatePerformanceData
): Promise<Performance | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/performances`, {
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
      message: `Failed to create performance: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updatePerformance(
  id: number,
  data: Partial<CreatePerformanceData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/performances/${id}`, {
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
      message: `Failed to update performance: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deletePerformance(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/performances/${id}`, {
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
      message: `Failed to delete performance: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
