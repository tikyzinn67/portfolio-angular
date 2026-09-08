import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
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
    ]),
    status: new FormControl<'rascunho' | 'publicado'>('rascunho', [
      Validators.required
    ])
  });

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.erro = '';

    this.service.listarTodos().subscribe({
      next: (lista) => {
        this.projetos = lista;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.erro = this.obterMensagemErro(
          err,
          'Não foi possível carregar os projetos.'
        );
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editar(p: Projeto) {
    this.erro = '';
    this.editandoId = p.id ?? null;

    this.form.patchValue({
      nome: p.nome,
      descricao: p.descricao,
      tecnologias: p.tecnologias,
      link_github: p.link_github,
      ano: p.ano,
      status: p.status ?? 'rascunho'
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados = this.form.value as Projeto;
    const estavaEditando = this.editandoId !== null;

    const requisicao = estavaEditando
      ? this.service.atualizar(this.editandoId!, dados)
      : this.service.criar(dados);

    requisicao.subscribe({
      next: () => {
        this.salvando = false;
        this.editandoId = null;

        this.form.reset({
          nome: '',
          descricao: '',
          tecnologias: '',
          link_github: '',
          ano: 2026,
          status: 'rascunho'
        });

        this.carregar();
        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.salvando = false;

        this.erro = this.obterMensagemErro(
          err,
          estavaEditando
            ? 'Não foi possível atualizar o projeto.'
            : 'Não foi possível criar o projeto.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  excluir(p: Projeto) {
    if (!p.id) {
      this.erro = 'Não foi possível identificar o projeto para excluir.';
      this.cdr.detectChanges();
      return;
    }

    if (
      !confirm(
        `Excluir o projeto "${p.nome}"? Esta ação não pode ser desfeita.`
      )
    ) {
      return;
    }

    this.erro = '';

    this.service.excluir(p.id).subscribe({
      next: () => {
        this.projetos = this.projetos.filter(
          projeto => projeto.id !== p.id
        );

        this.cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        this.erro = this.obterMensagemErro(
          err,
          `Não foi possível excluir o projeto "${p.nome}".`
        );

        this.cdr.detectChanges();
      }
    });
  }

  private obterMensagemErro(
    err: HttpErrorResponse,
    mensagemPadrao: string
  ): string {
    if (err.status === 0) {
      return 'Não foi possível conectar à API. Verifique se o servidor está ligado e tente novamente.';
    }

    if (err.error?.erro) {
      return err.error.erro;
    }

    return mensagemPadrao;
  }
}