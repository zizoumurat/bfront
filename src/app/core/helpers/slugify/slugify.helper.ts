import { Injectable } from '@angular/core';
import slugify from 'slugify';  

@Injectable({
  providedIn: 'root'
})
export class SlugifyHelper {

  generateSlug(value: string): string {
    if (!value) return '';
    
    return slugify(value, {
      lower: true,  
      strict: true 
    });
  }
}