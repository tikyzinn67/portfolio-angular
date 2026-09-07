import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Tecnologia, TecnologiaService } from '../tecnologia.service';

@Component({
  selector: 'app-catalogo',
  imports: [],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {
  private tecnologiaService = inject(TecnologiaService);
  private cdr = inject(ChangeDetectorRef);

  tecnologias: Tecnologia[] = [];
  erro = '';

  ngOnInit(): void {
    this.tecnologiaService.listar().subscribe({
      next: (dados) => {
        this.tecnologias = dados;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Erro ao carregar as tecnologias.';
        this.cdr.detectChanges();
      }
    });
  }
}