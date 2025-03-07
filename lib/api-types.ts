export interface ApiErrorResponse {
  message: string;
  success: false;
}

export interface ApiSuccessResponse<T> {
  message: string;
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Objective {
  id: string;
  description: string;
}

export interface ObjectivesData {
  objectives: Objective[];
}

export type ObjectivesResponse = ApiResponse<ObjectivesData>;