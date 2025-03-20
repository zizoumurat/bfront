import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbHelper {
  getBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: any[] = []): any[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      if (child.snapshot.data['breadcrumb']) {
        breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], url });
      }
      this.getBreadcrumb(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
