import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

// List all product images
const imgBase = 'E:/OpenCwork/build_website/外贸部/产品图片'
const allFiles: string[] = []

function walk(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full)
    else if (/\.(png|jpg|jpeg|webp|gif)$/i.test(e.name)) allFiles.push(full)
  }
}
walk(imgBase)

// Group by top-level folder
const byFolder: Record<string, string[]> = {}
for (const f of allFiles) {
  const rel = f.replace(imgBase + '/', '').replaceAll('\\', '/')
  const [top, ...rest] = rel.split('/')
  if (!byFolder[top]) byFolder[top] = []
  byFolder[top].push(rest.join('/'))
}

for (const [folder, files] of Object.entries(byFolder)) {
  console.log(`\n📁 ${folder} (${files.length} images)`)
  // Group by subfolder (R-code)
  const byCode: Record<string, string[]> = {}
  for (const f of files) {
    const parts = f.split('/')
    const code = parts[0]
    if (!byCode[code]) byCode[code] = []
    byCode[code].push(f)
  }
  for (const [code, imgs] of Object.entries(byCode)) {
    console.log(`   🔹${code}: ${imgs.map(i => i.split('/').pop()).join(', ')}`)
  }
}
