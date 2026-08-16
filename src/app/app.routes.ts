import { ResolveFn, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { findPost, findProject } from './core/portfolio-data';

const SITE = 'Nlend Max';

const projectTitle: ResolveFn<string> = (route) => {
  const project = findProject(route.paramMap.get('slug') ?? '');
  return project ? `${project.title} — ${SITE}` : `Projet introuvable — ${SITE}`;
};

const postTitle: ResolveFn<string> = (route) => {
  const post = findPost(route.paramMap.get('slug') ?? '');
  return post ? `${post.title} — ${SITE}` : `Article introuvable — ${SITE}`;
};

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: `${SITE} — Développeur & fondateur en série, Douala`,
  },
  {
    path: 'projets/:slug',
    title: projectTitle,
    loadComponent: () =>
      import('./pages/project-detail/project-detail').then((m) => m.ProjectDetail),
  },
  {
    path: 'blog',
    title: `Blog — ${SITE}`,
    loadComponent: () => import('./pages/blog-list/blog-list').then((m) => m.BlogList),
  },
  {
    path: 'blog/:slug',
    title: postTitle,
    loadComponent: () => import('./pages/blog-post/blog-post').then((m) => m.BlogPost),
  },
  { path: '**', redirectTo: '' },
];
