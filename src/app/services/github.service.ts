import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user';

export interface GitHubServiceInterface {
  getUsers(fromId: number, pageSize: number): Observable<User[]>;
}

@Injectable({
  providedIn: 'root'
})
export class GitHubService implements GitHubServiceInterface {

  constructor(private readonly httpClient: HttpClient) { }

  public getUsers(fromId: number = 0, pageSize: number = 30): Observable<User[]> {
    return this.httpClient.get<User[]>("./users.json", {
      responseType: "json",
      observe: "body",
      headers: new HttpHeaders({
        Accept: "application/vnd.github.v3+json",
      }),
      params: new HttpParams({
        fromObject: {
          since: fromId,
          per_page: pageSize,
        }
      }),
    }).pipe(tap(users => console.log(users)));
  }
}
function tap(arg0: (users: any) => void): import("rxjs").OperatorFunction<User[], User[]> {
  throw new Error('Function not implemented.');
}

