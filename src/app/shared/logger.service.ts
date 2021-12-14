import { Injectable } from '@angular/core';

enum LogLevel {
  Fatal = "fatal",
  Error = "error",
  Warning = "warning",
  Info = "info",
  Debug = "debug",
}

// TODO: please, implement the logger service
@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  public fatal(message: string, error: any, extra?: any) {
    this.log(LogLevel.Fatal, message, error, extra);
  }

  public error(message: string, error: any, extra?: any) {
    this.log(LogLevel.Error, message, error, extra);
  }

  public warn(message: string, error: any, extra?: any) {
    this.log(LogLevel.Warning, message, error, extra);
  }

  public info(message: string, extra?: any) {
    this.log(LogLevel.Info, message, undefined, extra);
  }

  public debug(message: string, extra?: any) {
    this.log(LogLevel.Debug, message, undefined, extra);
  }

  private log(level: LogLevel, message: string, error?: any, extra?: any) {
    console.log(`(${level}) ${message}`, {
      error,
      extra,
    });
  }
}
