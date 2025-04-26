"use server";

import { baseUrl } from "@/helpers/baseUrl";
import {
  AddEmployeeToTalentPoolData,
  ApiError,
  CreateTalentPoolData,
  TalentPool,
  TalentPoolWithEmployees,
} from "../types";

// Talent Pool actions
export async function getAllTalentPools(): Promise<
  TalentPoolWithEmployees[] | ApiError
> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools`, {
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
      message: `Failed to fetch talent pools: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getTalentPoolById(
  id: number
): Promise<TalentPoolWithEmployees | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools/${id}`, {
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
      message: `Failed to fetch talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createTalentPool(
  data: CreateTalentPoolData
): Promise<TalentPool | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools`, {
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
      message: `Failed to create talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updateTalentPool(
  id: number,
  data: Partial<CreateTalentPoolData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools/${id}`, {
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
      message: `Failed to update talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteTalentPool(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools/${id}`, {
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
      message: `Failed to delete talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function addEmployeeToTalentPool(
  data: AddEmployeeToTalentPoolData
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/talent-pools/employees`, {
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
      message: `Failed to add employee to talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function removeEmployeeFromTalentPool(
  talentPoolId: number,
  employeeId: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(
      `${baseUrl}/talent-pools/${talentPoolId}/employees/${employeeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { message: `Error: ${response.status} ${response.statusText}` };
    }

    return await response.json();
  } catch (error) {
    return {
      message: `Failed to remove employee from talent pool: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
