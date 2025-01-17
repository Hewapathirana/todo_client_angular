export interface TaskRequestDTO {
  title: string;
  description: string;
}


export interface TaskResponsesDTO {
  tasks: TaskResponseDTO[];
}

export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  isCompleted: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  statusCode: string;
  data: {
    taskResponseDTOList: TaskResponseDTO[];
    meta: any | null;
  };
  meta: any | null;
}

