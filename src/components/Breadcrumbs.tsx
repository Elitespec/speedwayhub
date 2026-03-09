import React from 'react'
import { SchemaOrg, createBreadcrumbSchema } from './SchemaOrg'

type BreadcrumbItem = {
  label: string
  href?: string
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const schemaItems = items.map((item, i) => ({
    name: item.label,
    url: item.href
      ? `https://speedwayhub.nz${item.href}`
      : `https://speedwayhub.nz`,
  }))

  return (
    <>
      <SchemaOrg schema={createBreadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-slate-600">/</span>}
              {item.href && i < items.length - 1 ? (
                <a href={item.href} className="hover:text-hub-red transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-slate-300">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
