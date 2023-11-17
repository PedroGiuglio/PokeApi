import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }


 getPokemon(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/pokemon/${id}`);
 }


 getPokemonRange(startId: number, endId: number): Observable<any[]> {
  const requests: Observable<any>[] = [];
  for (let i = startId; i <= endId; i++) {
    requests.push(this.http.get(`${this.apiUrl}/pokemon/${i}`));
  }
  return forkJoin(requests);
}

searchPokemonByName(name: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/pokemon/${name.toLowerCase()}`);
}

}
