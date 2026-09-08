import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Projeto, ProjetoService } from '../projeto.service';

@Component({
  selector: 'app-projetos',
  imports: [],
  templateUrl: './projetos.html',
  styleUrl: './projetos.css'
})
export class Projetos implements OnInit {
  private projetoService = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);

  projetos: Projeto[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.projetoService.listar().subscribe({
      next: (dados) => {
        this.projetos = dados;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Não foi possível carregar os projetos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }
}