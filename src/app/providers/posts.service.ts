import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

    constructor(
    private http: HttpClient
  ) { }
  getPosts(): Observable<any> {
    return this.http.get('https://dummyjson.com/posts');
  }
}
