import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {

    return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.status === 404) {
        errorMessage = 'Ressource non trouvée (404).';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur (500).';
      } else {
        errorMessage = `Erreur inconnue : ${error.message}`;
      }
      console.error('Erreur interceptée :', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};
