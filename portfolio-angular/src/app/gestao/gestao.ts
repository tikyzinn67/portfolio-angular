import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ProjetoService, Projeto } from '../projeto.service';

@Component({
  selector: 'app-gestao',
  imports: [ReactiveFormsModule],
  templateUrl: './gestao.html',
  styleUrl: './gestao.css'
})
export class Gestao implements OnInit {
  private service = inject(ProjetoService);
  private cdr = inject(ChangeDetectorRef);

  projetos: Projeto[] = [];
  carregando = true;
  erro = '';

  editandoId: number | null = null;
  salvando = false;

  form = new FormGroup({
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]),
    descricao: new FormControl(''),
    tecnologias: new FormControl(''),
    link_github: new FormControl(''),
    ano: new FormControl(2026, [
      Validators.required
    ])
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.service.listar().subscribe({
      next: (lista) => {
        this.projetos = lista;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Nao foi possivel carregar os projetos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editar(p: Projeto) {
    this.editandoId = p.id ?? null;
    this.form.patchValue(p);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = this.form.value as Projeto;

    const requisicao = this.editandoId
      ? this.service.atualizar(this.editandoId, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.salvando = false;
        this.erro = 'Nao foi possivel salvar. Tente de novo.';
        this.cdr.detectChanges();
      }
    });
  }

  excluir(p: Projeto) {
    if (!p.id) {
      return;
    }

    if (!confirm(`Excluir o projeto "${p.nome}"? Esta acao nao pode ser desfeita.`)) {
      return;
    }

    this.service.excluir(p.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter(
          projeto => projeto.id !== p.id
        );
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro = 'Nao foi possivel excluir. Tente de novo.';
        this.cdr.detectChanges();
      }
    });
  }
}