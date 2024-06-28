/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export enum LogColors {
  RED = "#F87171",
  ORANGE = "#FDBA74",
  YELLOW = "#FDE047",
  GREEN = "#4ADE80",
  BLUE = "#60A5FA",
  PURPLE = "#C084FC",
  GRAY = "#D1D5DB",
}

export interface Logger {
  error(message: string): void
  warn(message: string): void
  info(message: string): void
  log(message: string): void
  debug(message: string): void
  Extend(service: string): Logger
}
