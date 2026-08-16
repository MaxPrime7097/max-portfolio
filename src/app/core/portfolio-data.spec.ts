import { BLOG_POSTS, PROJECTS, SECTIONS, findPost, findProject } from './portfolio-data';

describe('portfolio data', () => {
  it('has unique project slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has unique blog slugs', () => {
    const slugs = BLOG_POSTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has a rail entry for every project', () => {
    for (const project of PROJECTS) {
      expect(SECTIONS.some((s) => s.id === project.slug)).toBe(true);
    }
  });

  it('keeps rail tints in sync with project accents', () => {
    for (const project of PROJECTS) {
      const section = SECTIONS.find((s) => s.id === project.slug);
      expect(section?.color).toBe(project.accent);
      expect(section?.tint).toBe(project.tint);
    }
  });

  it('has unique section ids', () => {
    const ids = SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('looks records up by slug', () => {
    expect(findProject('agriguard')?.title).toBe('AgriGuard');
    expect(findProject('nope')).toBeUndefined();
    expect(findPost(BLOG_POSTS[0].slug)?.slug).toBe(BLOG_POSTS[0].slug);
    expect(findPost('nope')).toBeUndefined();
  });
});
