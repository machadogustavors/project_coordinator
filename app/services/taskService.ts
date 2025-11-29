import { baseApi } from './shared/baseApi';
import { Task } from '@/app/types';

export const taskService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByProject: builder.query<Task[], string>({
      query: (projectId) => `/projects/${projectId}/tasks`,
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
              { type: 'Task', id: `PROJECT_${projectId}` },
            ]
          : [{ type: 'Task', id: 'LIST' }, { type: 'Task', id: `PROJECT_${projectId}` }],
    }),

    getTaskById: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<Task, { projectId: string; data: Omit<Task, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> }>({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: 'Task', id: 'LIST' },
        { type: 'Task', id: `PROJECT_${projectId}` },
        { type: 'Project', id: projectId },
      ],
    }),

    updateTask: builder.mutation<Task, { id: string; data: Partial<Task> }>({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTasksByProjectQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskService;
