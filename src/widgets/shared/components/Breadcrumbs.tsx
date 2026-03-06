import React from 'react';

interface PageProps {
  currentSlug: string[]
}

const breadcrumbsSlug = (slug: string[], index: number) => slug.slice(0, index + 1).join('/');

export default async function Breadcrumbs({ currentSlug }: PageProps) {


  return (
    <div>
      {currentSlug.map((item, index) => (
        <a key={breadcrumbsSlug(currentSlug, index)} href={`/wiki/${breadcrumbsSlug(currentSlug, index)}`}>/{item}</a>
      ))}
    </div>
  );
};