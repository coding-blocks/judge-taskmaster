import config = require('../../../config.js')
import * as fs from 'fs'
import * as YAML from 'yaml'
import { cat, exec, mkdir, cp, ls } from 'shelljs'
import { execSync } from 'child_process'
import { ProjectJob } from '../jobs/project'
import { ProjectResult } from 'types/result'
import * as path from 'path'
import { Scenario } from 'tasks/scenario'
import { download } from 'utils/request'

export default class ProjectScenario extends Scenario {
  async setup(currentJobDir: string, job: ProjectJob) {
    const projectPath = path.join(currentJobDir, 'project.zip')
    const solutionPath = path.join(currentJobDir, 'solution.zip')
    const config = YAML.parse(job.config)

    await Promise.all([
      download(job.problem, projectPath),
      download(job.source, solutionPath)
    ])

    exec(`mkdir -p ${currentJobDir}/project && unzip -d ${currentJobDir}/project ${projectPath}`)
    exec(`mkdir -p ${currentJobDir}/solution && unzip -d ${currentJobDir}/solution ${solutionPath}`)

    config.project['allowed-folders'].map(glob => {
      execSync(`shopt -s globstar && rsync -R ${glob} ${currentJobDir}/project`, {
        cwd: `${currentJobDir}/solution`,
        shell: 'bash'
      })
    })
    fs.writeFileSync(`${currentJobDir}/project.yml`, job.config)
  }

  run(currentJobDir: string, job: ProjectJob) {
    const PROJECT_CONFIG = config.PROJECT[job.lang]
    return exec(`docker run \\
        --cpus="${PROJECT_CONFIG.CPU_SHARE}" \\
        --memory="${PROJECT_CONFIG.MEM_LIMIT}" \\
        --rm \\
        -v "${currentJobDir}":/usr/src/runbox \\
        -w /usr/src/runbox codingblocks/project-worker-"${job.lang}" \\
        /bin/judge.py -t ${job.timelimit || 20}
    `);
  }

  async result(currentJobDir: string, job: ProjectJob): Promise<ProjectResult> {
    const setup_stdout = cat(path.join(currentJobDir, 'setup.stdout')).toString()
    const setup_stderr = cat(path.join(currentJobDir, 'setup.stderr')).toString()

    if (setup_stderr) {
      return {
        id: job.id,
        scenario: 'project',
        stderr: (new Buffer(setup_stderr)).toString('base64'),
        testcases: []
      }
    }

    const testcases = ls(path.join(currentJobDir, 'result')).map(index => {
      const currentTestcasePath = path.join(currentJobDir, 'result', index)

      const stderr = cat(path.join(currentTestcasePath, 'run.stderr')).toString()
      const time = cat(path.join(currentTestcasePath, 'run.time')).toString().trim()
      const code = cat(path.join(currentTestcasePath, 'run.code')).toString().trim()
      const stdout = cat(path.join(currentTestcasePath, 'run.stdout')).toString()

      const score = +code === 0 ? 100 : 0

      return {
        id: +index,
        time,
        stdout: (new Buffer(stdout)).toString('base64'),
        stderr: (new Buffer(stderr)).toString('base64'),
        score
      }
    })

    return {
      id: job.id,
      scenario: 'project',
      stderr: (new Buffer(setup_stderr)).toString('base64'),
      testcases
    }
  }
}
