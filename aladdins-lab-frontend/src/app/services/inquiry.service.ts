import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactInquiry } from '../models/contact-inquiry.model';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly apiUrl = 'https://api.web3forms.com/submit';
  private readonly accessKey = 'YOUR_WEB3FORMS_ACCESS_KEY';

  constructor(private http: HttpClient) {}

  submitInquiry(inquiry: ContactInquiry): Observable<any> {
    const userTypeLabel = inquiry.userType === 'company' ? 'Company / Brand' : 'Individual';
    const payload: Record<string, any> = {
      access_key: this.accessKey,
      subject: `[${inquiry.inquiryType}] - Message from ${inquiry.name} (${userTypeLabel})`,
      from_name: inquiry.name,
      email: inquiry.email,
      message: `[${userTypeLabel}] [${inquiry.inquiryType}] ${inquiry.message}`,
      redirect_to: 'https://aladdinlab.net/work-with-me?success=true',
      user_type: userTypeLabel
    };

    if (inquiry.userType === 'company' && inquiry.companyName) {
      payload['company_name'] = inquiry.companyName;
    }

    return this.http.post<any>(this.apiUrl, payload);
  }
}