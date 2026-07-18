import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactInquiry } from '../models/contact-inquiry.model';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly apiUrl = 'http://localhost:8080/api/v1/inquiries';

  constructor(private http: HttpClient) {}

  submitInquiry(inquiry: ContactInquiry): Observable<ContactInquiry> {
    return this.http.post<ContactInquiry>(this.apiUrl, inquiry);
  }
}