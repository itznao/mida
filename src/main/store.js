import { app } from 'electron'
import { join } from 'path'
import { readFileSync, existsSync, renameSync, writeFileSync, copyFileSync  } from 'fs'
import YAML from 'yaml'

import appsPath from '../../resources/apps.yaml?asset'
import userDataDefaultPath from '../../resources/userData.default.yaml?asset'

const userDataPath = join(app.getPath('userData'), 'userData.yaml')

export function ensureUserData() {
  console.log('Checking if userData exists.')
  if (!existsSync(userDataPath)) {
    console.log('userData does not exist, creating file.')
    copyFileSync(userDataDefaultPath, userDataPath)
    console.log('Created userData file.')
  }
}

export function loadUserData(loopProtect = false) {
  ensureUserData()

  try {
    console.log('Reading userData file.')
    const file = readFileSync(userDataPath, 'utf8')
    const data = YAML.parse(file)
    console.log('Parsed userData file:', data)

    if (typeof data !== 'object' || data === null) {
      throw console.log('userData not valid, making new userData file.')
    }

    return data
  } catch (err) {
    console.log('Failed to load userData:', err)

    if (loopProtect) {
      return {}
    }

    renameSync(
      userDataPath,
      join(app.getPath('userData'), `userData.corrupted.${crypto.randomUUID()}.yaml`)
    )

    return loadUserData(true)
  }
}

export function saveUserData(path, value) {
  ensureUserData()

  console.log('Reading userData file.')
  const file = readFileSync(userDataPath, 'utf8')
  const doc = YAML.parseDocument(file)
  console.log('Parsed userData file:', doc.toJS())

  doc.setIn(path, doc.createNode(value))

  try {
    const tempPath = userDataPath + '.tmp'
    writeFileSync(tempPath, doc.toString({ collectionStyle: 'block' }))
    renameSync(tempPath, userDataPath)
    console.log('Saved userData file.')
  } catch (err) {
    console.log('Failed to load userData:', err)
  }
}

export function loadApps() {
  console.log('Reading defaultApps file.')
  const defaultAppsFile = readFileSync(appsPath, 'utf8')
  const categories = YAML.parse(defaultAppsFile).categories
  console.log('Read defaultApps file:', categories)

  const userData = loadUserData()

  const pinnedApps = userData.pinnedApps ?? []
  const customCategories = userData.customCategories ?? {}
  const customApps = userData.customApps ?? {}

  const categoryList = categories.map((category) => category.id)

  for (const id in customCategories) {
    const customCategory = customCategories[id]

    if (categoryList.includes(id)) continue
    categories.push({ id, text: customCategory.text, apps: [] })
    console.log('Pushed category ' + customCategory.text + '.')
  }

  for (const category of categories) {
    for (const id in customApps) {
      const customApp = customApps[id]

      if (customApp.category !== category.id) continue
      if (!customApp.text || !customApp.url || !customApp.image) continue

      category.apps.push({ id, ...customApp })
      console.log('Pushed app ' + id + '.')
    }

    for (const app of category.apps) {
      app.pinned = pinnedApps.includes(app.id)
      if (app.pinned) console.log('Added pinned app ' + app.id + '.')
    }
  }

  return categories
}

export function togglePin(id) {
  const userData = loadUserData()
  const pinnedApps = userData.pinnedApps ?? []

  if (pinnedApps.includes(id)) {
    console.log('Removed pinned app ' + id + '.')
    pinnedApps.splice(pinnedApps.indexOf(id), 1)
  } else {
    console.log('Added pinned app ' + id + '.')
    pinnedApps.push(id)
  }

  saveUserData(['pinnedApps'], pinnedApps)
}
