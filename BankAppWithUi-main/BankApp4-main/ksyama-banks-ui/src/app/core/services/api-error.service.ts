import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ProblemDetail } from '../models/problem-detail.model';

@Injectable({ providedIn: 'root' })
export class ApiErrorService {
  getMessage(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object') {
      const detail = error.error as ProblemDetail;
      if (detail.detail) {
        return detail.detail;
      }
      if (detail.message) {
        return detail.message;
      }
      if (detail.errors) {
        return Object.values(detail.errors).join(', ');
      }
    }

    if (typeof error.error === 'string' && error.error.trim().length > 0) {
      return error.error;
    }

    return error.message || 'Unexpected error occurred. Please try again.';
  }
}
