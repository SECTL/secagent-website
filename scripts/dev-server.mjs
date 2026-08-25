import { execFileSync, spawn } from 'node:child_process'
import { createConnection } from 'node:net'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = 45396
const HOST = '127.0.0.1'

function portIsOpen() {
  return new Promise((resolveResult) => {
    const socket = createConnection({ host: HOST, port: PORT })
    socket.once('connect', () => {
      socket.destroy()
      resolveResult(true)
    })
    socket.once('error', () => {
      socket.destroy()
      resolveResult(false)
    })
  })
}

function getListeningPids() {
  if (process.platform === 'win32') {
    const output = execFileSync('netstat.exe', ['-ano', '-p', 'tcp'], {
      encoding: 'utf8',
      windowsHide: true
    })
    const pids = new Set()

    for (const line of output.split(/\r?\n/)) {
      const parts = line.trim().split(/\s+/)
      if (
        parts.length >= 5 &&
        parts[0].toUpperCase() === 'TCP' &&
        parts[1].endsWith(`:${PORT}`) &&
        parts[3].toUpperCase() === 'LISTENING'
      ) {
        pids.add(parts[4])
      }
    }

    return [...pids]
  }

  try {
    return execFileSync('lsof', ['-ti', `tcp:${PORT}`], {
      encoding: 'utf8'
    })
      .split(/\s+/)
      .filter(Boolean)
  } catch {
    return []
  }
}

async function freePort() {
  if (!(await portIsOpen())) {
    return
  }

  const pids = getListeningPids()
  if (pids.length === 0) {
    throw new Error(`端口 ${PORT} 已被占用，但无法找到占用进程。`)
  }

  console.log(`端口 ${PORT} 已被占用，正在终止进程：${pids.join(', ')}`)
  for (const pid of pids) {
    if (process.platform === 'win32') {
      execFileSync('taskkill.exe', ['/PID', pid, '/T', '/F'], {
        stdio: 'inherit',
        windowsHide: true
      })
    } else {
      process.kill(Number(pid), 'SIGTERM')
    }
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (!(await portIsOpen())) {
      return
    }
    await new Promise((resolveResult) => setTimeout(resolveResult, 100))
  }

  throw new Error(`无法释放端口 ${PORT}。`)
}

await freePort()

const scriptDir = dirname(fileURLToPath(import.meta.url))
const vitepressBin = resolve(scriptDir, '../node_modules/vitepress/bin/vitepress.js')
const child = spawn(
  process.execPath,
  [vitepressBin, 'dev', 'docs', '--host', HOST, '--port', String(PORT), '--strictPort'],
  { stdio: 'inherit', windowsHide: false }
)

let shuttingDown = false

function stopChild() {
  if (shuttingDown || child.killed) {
    return
  }

  shuttingDown = true
  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
        stdio: 'ignore',
        windowsHide: true
      })
    } catch {
      // The child may have already exited between the signal and taskkill.
    }
  } else {
    child.kill('SIGTERM')
  }
}

process.once('SIGINT', stopChild)
process.once('SIGTERM', stopChild)

child.on('exit', (code, signal) => {
  process.exit(shuttingDown ? 0 : code ?? (signal ? 1 : 0))
})
