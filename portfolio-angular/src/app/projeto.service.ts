import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Projeto {
  id?: number;
  nome: string;
  descricao: string;
  tecnologias: string;
  link_github: string;
  ano: number;
  status?: 'rascunho' | 'publicado';
}

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  private http = inject(HttpClient);

  private url =
  'https://organic-disco-7vqxpxg7wjj53wq-3000.app.github.dev/api/projetos';

  listar(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(this.url);
  }

  listarTodos(): Observable<Projeto[]> {
    return this.http.get<Projeto[]>(`${this.url}?todos=1`);
  }

  criar(projeto: Projeto): Observable<{ id?: number; mensagem?: string }> {
    return this.http.post<{ id?: number; mensagem?: string }>(
      this.url,
      projeto
    );
  }

  atualizar(
    id: number,
    projeto: Projeto
  ): Observable<{ id?: number; mensagem?: string }> {
    return this.http.put<{ id?: number; mensagem?: string }>(
      `${this.url}?id=${id}`,
      projeto
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}?id=${id}`);
  }
}