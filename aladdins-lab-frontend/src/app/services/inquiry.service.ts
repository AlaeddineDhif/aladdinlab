import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactInquiry } from '../models/contact-inquiry.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly apiUrl = 'https://api.web3forms.com/submit';
  private readonly accessKey = environment.web3formsAccessKey;

  constructor(private http: HttpClient) {}

  submitInquiry(inquiry: ContactInquiry): Observable<any> {
    const payload: Record<string, any> = {
      access_key: this.accessKey,
      subject: `[${inquiry.inquiryType}] - Message from ${inquiry.name} (${inquiry.userType})`,
      from_name: inquiry.name,
      email: inquiry.email,
      message: inquiry.message,
      user_type: inquiry.userType,
      company_name: inquiry.companyName || 'N/A'
    };

    return this.http.post<any>(this.apiUrl, payload);
  }
}