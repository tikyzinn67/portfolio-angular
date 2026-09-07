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
  erro = '';

  ngOnInit(): void {
    this.projetoService.listar().subscribe({
      next: (dados) => {
        this.projetos = dados;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar os projetos.';
        this.cdr.detectChanges();
      }
    });
  }
}