import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface NovoContato {
  nome: string;
  email: string;
  mensagem: string;
}

export interface RespostaContato {
  sucesso: boolean;
  id: number;
  mensagem: string;
}

@Injectable({ providedIn: 'root' })
export class ContatoService {
  private http = inject(HttpClient);

  private url =
    'https://organic-disco-7vqxpxg7wjj53wq-8000.app.github.dev/api/contato.php';

  enviar(dados: NovoContato): Observable<RespostaContato> {
    return this.http
      .post<RespostaContato>(this.url, dados)
      .pipe(timeout(5000));
  }
}