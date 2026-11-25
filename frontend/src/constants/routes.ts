export const ROUTES = {
  home: "/",
  projects: "/projects",
  newProject: "/projects/new",
  project: (id: string) => `/projects/${id}`,
  storyboard: (id: string) => `/projects/${id}/storyboard`,
  preview: (id: string) => `/projects/${id}/preview`,
} as const;
