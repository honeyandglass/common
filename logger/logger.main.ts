/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { LogColors, type Logger, LogLevel } from './logger.types.ts'
import { Maybe } from 'folklore'
import chalk from 'chalk'

export class HoneyLogger implements Logger {
  private readonly _level: LogLevel
  private readonly _prefix: Maybe<string>
  private readonly _services: Maybe<string>[]

  constructor(prefix?: string, level: LogLevel = LogLevel.INFO, ...services: string[]) {
    this._prefix = Maybe.FromNullable(prefix)
    this._services = services.map(Maybe.FromNullable)
    this._level = level
  }

  private paint(message: string, color: LogColors): string {
    return chalk.hex(color)(message)
  }

  private get prefix(): string {
    return this._prefix.matchWith({
      Just: (prefix) => this.paint(`[${prefix}]  `, LogColors.PURPLE),
      Nothing: () => '',
    })
  }

  private get services(): string {
    const services: string = this._services.reduce<string>((final, service) => {
      const current = service.getOrElse('')
      return final.length ? `${final}/${current}` : current
    }, '')
    return services.length ? this.paint(`(${services})  `, LogColors.ORANGE) : ''
  }

  private get timestamp(): string {
    const timestamp = new Date()
    const date = timestamp.toLocaleDateString(undefined, {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    })
    const time = timestamp.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const datetime = `${date}  ${time}  `
    return this.paint(datetime, LogColors.GRAY)
  }

  private format(message: string, level: number, color: LogColors): string {
    const prefix = `${this.prefix}${this.timestamp}${this.services}`
    const log_level = this.paint(LogLevel[level], color)
    return `${prefix}${log_level}  -  ${this.paint(message, color)}`
  }

  public error(message: string): void {
    if (this._level < LogLevel.ERROR) return
    console.error(this.format(message, LogLevel.ERROR, LogColors.RED))
  }

  public warn(message: string): void {
    if (this._level < LogLevel.WARN) return
    console.warn(this.format(message, LogLevel.WARN, LogColors.YELLOW))
  }

  public info(message: string): void {
    if (this._level < LogLevel.INFO) return
    console.info(this.format(message, LogLevel.INFO, LogColors.GREEN))
  }

  public log(message: string): void {
    this.info(message)
  }

  public debug(message: string): void {
    if (this._level < LogLevel.DEBUG) return
    console.debug(this.format(message, LogLevel.DEBUG, LogColors.BLUE))
  }

  public Extend(name: string): HoneyLogger {
    const prefix = this._prefix.isJust() ? this._prefix.getOrThrow() : undefined
    const services = this._services.map((service) => service.getOrThrow())
    return new HoneyLogger(prefix, this._level, ...services, name)
  }
}
