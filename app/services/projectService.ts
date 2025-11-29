import { baseApi } from './shared/baseApi';
import { Project } from '@/app/types';

export const projectService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => '/projects',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Project' as const, id })),
              { type: 'Project', id: 'LIST' },
            ]
          : [{ type: 'Project', id: 'LIST' }],
    }),

    getProjectById: builder.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    createProject: builder.mutation<Project, Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (data) => ({
        url: '/projects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: builder.mutation<Project, { id: string; data: Partial<Project> }>({
      query: ({ id, data }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    deleteProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
        { type: 'Task', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectService;
