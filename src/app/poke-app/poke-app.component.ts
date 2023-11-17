import { Component, HostListener  } from '@angular/core';
import { PokeApiService } from '../services/poke-api.service';
import { forkJoin } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-poke-app',
  templateUrl: './poke-app.component.html',
  styleUrls: ['./poke-app.component.css']
})
export class PokeAppComponent {

 
  scrollUpDistance = 2;
  scrollDistance = 1;

  searchTerm: string = '';
  pokemonList: any[] = [];
  filteredPokemonList: any[] = []; 

  constructor(private pokeApiService: PokeApiService) {}

  ngOnInit() {
    this.getListaPokeOriginal(151);
    this.getPokemonList();
  }
  
  startPokemonId = 1;
  endPokemonId = 10;
  numId: number = 0;
  

  loadMorePokemonsUp() {
    // Decrementa el rango para cargar más Pokémon hacia arriba
    this.startPokemonId -= 10;
    this.endPokemonId -= 10;
  
    if (this.startPokemonId < 1) {
      // Evitar cargar Pokémon con IDs negativos o cero
      this.startPokemonId = 1;
    }
  
    this.getPokemonList();
    console.log("hola")
  }

  loadMorePokemons() {
    // Incrementa el rango para cargar más Pokémon
    this.startPokemonId += 10;
    this.endPokemonId += 10;
  
    if (this.endPokemonId > 151) {
      this.endPokemonId = 151;
    }

    this.getPokemonList();
  }
  
  getListaPokeOriginal(count: number){
    const requests = [];

    for (let i = 1; i <= count; i++) {
      requests.push(this.pokeApiService.getPokemon(i));
    }

    // Utilizamos forkJoin para realizar todas las solicitudes simultáneamente
    forkJoin(requests).subscribe(
      (data: any[]) => {
        this.pokemonList = data;
        console.log(this.pokemonList);
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
  }

  getPokemonList() {
    this.pokeApiService.getPokemonRange(this.startPokemonId, this.endPokemonId)
      .subscribe((data: any[]) => {
        // Concatena los nuevos Pokémon a la lista existente
        this.pokemonList = this.pokemonList.concat(data.map(pokemon => ({
          id: pokemon.id,
          name: pokemon.name,
          height: pokemon.height,
          weight: pokemon.weight,
          types: pokemon.types,
          sprites: pokemon.sprites,
        }
        )));

        this.pokemonList.forEach((pokemon: any) => {
          // console.log(pokemon.types.map((type: any) => type.type.name).join(', '));
        });

        this.filteredPokemonList = this.pokemonList;
      });
  }

  getPokemonTypeClasses(pokemon: any): string {
    const classes = pokemon.types.map((typeObj: any) => typeObj.type.name);
    return classes.join(' ');
  }


  searchPokemon() {
    this.pokeApiService.searchPokemonByName(this.searchTerm).subscribe((data: any) => {
      this.pokemonList = [data];
    });
  }

  noMatchesFound: boolean = false;

  onSearchChange(searchValue: string): void {
    if (searchValue.trim() === '') {
      this.filteredPokemonList = this.pokemonList;
      this.noMatchesFound = false; 
    } else {
      this.pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      this.filteredPokemonList = this.pokemonList.filter(pokemon=> 
        pokemon.id.toString().includes(searchValue)
      );
      this.noMatchesFound = this.filteredPokemonList.length === 0;
    } 
  }

  getPokemonData(id: number) {
    return this.pokeApiService.getPokemon(id);
  }

  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Muestra u oculta el botón dependiendo de la posición del scroll
    this.showScrollButton = window.scrollY > 200;
    // console.log(this.showScrollButton);
  }

  scrollToTop(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
