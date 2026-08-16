import { ResolveFn, Routes } from '@angular/router';
import { findProject } from './data/projects';

const SITE = 'Nlend Max';

const projectTitle: ResolveFn<string> = (route) => {
  const project = findProject(route.paramMap.get('slug') ?? '');
  return project ? `${project.title} — ${SITE}` : `Projet introuvable — ${SITE}`;
};

export const routes: Routes = [
  {
    path: 'projets/:slug',
    title: projectTitle,
    loadComponent: () =>
      import('./components/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  { path: '**', redirectTo: '' },
];
