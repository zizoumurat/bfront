import { HttpInterceptorFn } from '@angular/common/http';
import { HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const dateFormatInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.body instanceof FormData) {
    return next(req);
  }

  const modifiedReq = req.clone({ body: convertDatesToLocalISOString(req.body) });

  return next(modifiedReq).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse && event.body) {
        const modifiedBody = convertStringsToDate(event.body);
        return event.clone({ body: modifiedBody });
      }
      return event;
    })
  );
};

// Tarihleri yerel saat diliminde ISO string olarak dönüştür
function convertDatesToLocalISOString(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  for (const key of Object.keys(body)) {
    if (body[key] instanceof Date) {
      body[key] = formatToLocalISOString(body[key]);
    } else if (typeof body[key] === 'object') {
      body[key] = convertDatesToLocalISOString(body[key]);
    }
  }
  return body;
}

// Yerel saat diliminde ISO string'e dönüştür
function formatToLocalISOString(date: Date): string {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, -1);
  return localISOTime;
}

function convertStringsToDate(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;

  for (const key of Object.keys(body)) {
    const value = body[key];
    if (typeof value === 'string' && isoDateRegex.test(value) && !isNaN(Date.parse(value))) {
      body[key] = new Date(value);
    } else if (typeof value === 'object') {
      body[key] = convertStringsToDate(value);
    }
  }
  return body;
}