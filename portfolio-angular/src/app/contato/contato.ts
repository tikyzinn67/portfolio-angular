import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators
} from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { finalize, TimeoutError } from 'rxjs';
import { ContatoService } from '../contato.service';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contato.html',
  styleUrl: './contato.css'
})
export class Contato {
  private fb = inject(FormBuilder);
  private service = inject(ContatoService);
  private elemento = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  enviando = false;
  sucesso = '';
  erro = '';

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    mensagem: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    this.sucesso = '';
    this.erro = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.detectChanges();

      const primeiroInvalido = this.elemento.nativeElement.querySelector(
        'input.ng-invalid, textarea.ng-invalid'
      ) as HTMLElement | null;

      primeiroInvalido?.focus();
      return;
    }

    this.enviando = true;
    this.cdr.detectChanges();

    this.service
      .enviar(this.form.getRawValue())
      .pipe(
        finalize(() => {
          this.enviando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (resp) => {
          this.sucesso = resp.mensagem;
          this.form.reset();
        },

        error: (err: HttpErrorResponse | TimeoutError) => {
          if (err instanceof TimeoutError) {
            this.erro =
              'Não foi possível conectar ao servidor. Tente novamente.';
            return;
          }

          const errosBackend = err.error?.erros;

          if (Array.isArray(errosBackend) && errosBackend.length > 0) {
            this.erro = errosBackend.join(' ');
          } else if (err.status === 0) {
            this.erro =
              'Não foi possível conectar ao servidor. Tente novamente.';
          } else {
            this.erro =
              'Não foi possível enviar. Tente novamente.';
          }
        }
      });
  }
}