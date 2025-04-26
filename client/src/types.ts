export type CustomError = {
  message: string;
  status: number;
};

export type AppError = CustomError | Error;

//? EmployeeData
export interface Department {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPosition {
  id: number;
  title: string;
  department_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Performance {
  id: number;
  employee_id: number;
  evaluation_date: string;
  score: number;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSkill {
  employee_id: number;
  skill_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  EmployeeSkill: EmployeeSkill;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department_id: number;
  job_position_id: number;
  hire_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  Department: Department;
  JobPosition: JobPosition;
  Performances: Performance[];
  Skills: Skill[];
}

export interface ApiError {
  message: string;
}

export interface CreateEmployeeData {
  name: string;
  email: string;
  phone: string;
  department_id: number;
  job_position_id: number;
  hire_date: string;
  status: string;
}

export interface AddEmployeeSkillData {
  employee_id: number;
  skill_id: number;
}

//? DepartmentData
export interface Department {
  id: number;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  Employees?: Employee[];
}

export interface CreateDepartmentData {
  name: string;
  location: string;
}

//? JobPositionData
export interface JobPosition {
  id: number;
  title: string;
  department_id: number;
  createdAt: string;
  updatedAt: string;
  Department?: Department;
}

export interface CreateJobPositionData {
  title: string;
  department_id: number;
}
