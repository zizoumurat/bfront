import { Injectable, InjectionToken } from '@angular/core';
import { LocationModel } from '../core/domain/location.model';
import { ILocationService } from '../core/services/i.location.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base/base.service';

@Injectable({
    providedIn: 'root',
})
export class LocationService extends BaseService<LocationModel> implements ILocationService {
    constructor(protected override http: HttpClient) {
        super(http, 'Locations');
    }
}

export const LOCATION_SERVICE = new InjectionToken<ILocationService>('LocationService');
