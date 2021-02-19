import { join } from 'path'

export const PUPPETEER_EXECUTABLE_PATH: string | undefined = process.env.PUPPETEER_EXECUTABLE_PATH

export const SNAPSHOTS_DIRECTORY: string = process.env.SNAPSHOTS_DIRECTORY || join(__dirname, '..', 'snapshots')
export const REPORT_DIRECTORY: string = process.env.REPORT_DIRECTORY || join(__dirname, '..', 'report')

export const CONCURRENT_TESTS: number = Number(process.env.CONCURRENT_TESTS || 10)
export const STANDARD: string = process.env.STANDARD || 'WCAG2AA'
export const ADDITIONAL_RULES: string[] = process.env.ADDITIONAL_RULES?.split(',') || []
