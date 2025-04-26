"use server";

import { baseUrl } from "@/helpers/baseUrl";
import {
  ApiError,
  CreateSkillData,
  Employee,
  Skill,
  SkillWithEmployees,
} from "../types";

// Skill actions
export async function getAllSkills(): Promise<SkillWithEmployees[] | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills`, {
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
      message: `Failed to fetch skills: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getSkillById(
  id: number
): Promise<SkillWithEmployees | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills/${id}`, {
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
      message: `Failed to fetch skill: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function createSkill(
  data: CreateSkillData
): Promise<Skill | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills`, {
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
      message: `Failed to create skill: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function updateSkill(
  id: number,
  data: Partial<CreateSkillData>
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills/${id}`, {
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
      message: `Failed to update skill: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function deleteSkill(
  id: number
): Promise<{ message: string } | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills/${id}`, {
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
      message: `Failed to delete skill: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

export async function getEmployeesBySkill(
  skillId: number
): Promise<Employee[] | ApiError> {
  try {
    const response = await fetch(`${baseUrl}/skills/${skillId}/employees`, {
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
      message: `Failed to fetch employees with skill: ${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}
