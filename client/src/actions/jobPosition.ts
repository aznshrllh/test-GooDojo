"use server";

import { baseUrl } from "@/helpers/baseUrl";
import { ApiError, CreateJobPositionData, JobPosition } from "../types";

// Job Position actions
export async function getAllJobPositions(): Promise<JobPosition[] | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/job-positions`, {
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
      message: `Failed to fetch job positions: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getJobPositionById(
  id: number
): Promise<JobPosition | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/job-positions/${id}`, {
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
      message: `Failed to fetch job position: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createJobPosition(
  data: CreateJobPositionData
): Promise<JobPosition | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/job-positions`, {
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
      message: `Failed to create job position: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updateJobPosition(
  id: number,
  data: Partial<CreateJobPositionData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/job-positions/${id}`, {
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
      message: `Failed to update job position: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteJobPosition(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/job-positions/${id}`, {
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
      message: `Failed to delete job position: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
