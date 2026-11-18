import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'
import { DB_FILE } from './config.js'
import { destinations } from './seed/destinations.js'
import { posts, projects } from './seed/content.js'

fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })

const db = new Database(DB_FILE)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS destinations (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    country     TEXT NOT NULL,
    region      TEXT NOT NULL,
    rating      REAL NOT NULL DEFAULT 0,
    tags        TEXT NOT NULL DEFAULT '[]',
    featured    INTEGER NOT NULL DEFAULT 0,
    summary     TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image       TEXT NOT NULL DEFAULT '',
    gallery     TEXT NOT NULL DEFAULT '[]',
    facts       TEXT NOT NULL DEFAULT '{}',
    sort_order  INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    desc       TEXT NOT NULL DEFAULT '',
    tags       TEXT NOT NULL DEFAULT '[]',
    category   TEXT NOT NULL DEFAULT 'web',
    link       TEXT NOT NULL DEFAULT '#',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS posts (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    date       TEXT NOT NULL,
    summary    TEXT NOT NULL DEFAULT '',
    tags       TEXT NOT NULL DEFAULT '[]',
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS guestbook_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL,
    ip         TEXT NOT NULL DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    subject    TEXT NOT NULL DEFAULT '',
    message    TEXT NOT NULL,
    ip         TEXT NOT NULL DEFAULT '',
    user_agent TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS planner_items (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id   TEXT NOT NULL,
    text       TEXT NOT NULL,
    priority   TEXT NOT NULL DEFAULT '中',
    done       INTEGER NOT NULL DEFAULT 0,
    position   INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_planner_owner ON planner_items (owner_id, position, id);
  CREATE INDEX IF NOT EXISTS idx_guestbook_created ON guestbook_messages (created_at DESC);
`)

const upsertDestination = db.prepare(`
  INSERT INTO destinations
    (id, name, country, region, rating, tags, featured, summary, description, image, gallery, facts, sort_order)
  VALUES
    (@id, @name, @country, @region, @rating, @tags, @featured, @summary, @description, @image, @gallery, @facts, @sort_order)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    country = excluded.country,
    region = excluded.region,
    rating = excluded.rating,
    tags = excluded.tags,
    featured = excluded.featured,
    summary = excluded.summary,
    description = excluded.description,
    image = excluded.image,
    gallery = excluded.gallery,
    facts = excluded.facts,
    sort_order = excluded.sort_order
`)

const upsertProject = db.prepare(`
  INSERT INTO projects (id, title, desc, tags, category, link, sort_order)
  VALUES (@id, @title, @desc, @tags, @category, @link, @sort_order)
  ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    desc = excluded.desc,
    tags = excluded.tags,
    category = excluded.category,
    link = excluded.link,
    sort_order = excluded.sort_order
`)

const upsertPost = db.prepare(`
  INSERT INTO posts (id, title, date, summary, tags, sort_order)
  VALUES (@id, @title, @date, @summary, @tags, @sort_order)
  ON CONFLICT(id) DO UPDATE SET
    title = excluded.title,
    date = excluded.date,
    summary = excluded.summary,
    tags = excluded.tags,
    sort_order = excluded.sort_order
`)

const seed = db.transaction(() => {
  destinations.forEach((item, index) => {
    upsertDestination.run({
      id: item.id,
      name: item.name,
      country: item.country,
      region: item.region,
      rating: item.rating,
      tags: JSON.stringify(item.tags),
      featured: item.featured ? 1 : 0,
      summary: item.summary,
      description: item.description,
      image: item.image,
      gallery: JSON.stringify(item.gallery),
      facts: JSON.stringify(item.facts),
      sort_order: index,
    })
  })

  projects.forEach((item, index) => {
    upsertProject.run({
      id: item.id,
      title: item.title,
      desc: item.desc,
      tags: JSON.stringify(item.tags),
      category: item.category,
      link: item.link,
      sort_order: index,
    })
  })

  posts.forEach((item, index) => {
    upsertPost.run({
      id: item.id,
      title: item.title,
      date: item.date,
      summary: item.summary,
      tags: JSON.stringify(item.tags),
      sort_order: index,
    })
  })
})

seed()

function parseJson(value, fallback) {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export function mapDestination(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    region: row.region,
    rating: row.rating,
    tags: parseJson(row.tags, []),
    featured: row.featured === 1,
    summary: row.summary,
    description: row.description,
    image: row.image,
    gallery: parseJson(row.gallery, []),
    facts: parseJson(row.facts, {}),
  }
}

export function mapProject(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    desc: row.desc,
    tags: parseJson(row.tags, []),
    category: row.category,
    link: row.link,
  }
}

export function mapPost(row) {
  if (!row) return null
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    summary: row.summary,
    tags: parseJson(row.tags, []),
  }
}

export function mapGuestbookMessage(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  }
}

export function mapPlannerItem(row) {
  if (!row) return null
  return {
    id: row.id,
    text: row.text,
    priority: row.priority,
    done: row.done === 1,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export default db
