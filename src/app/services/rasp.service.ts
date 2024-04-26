import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, filter, map } from 'rxjs';
import { StrictHttpResponse } from './strict-http-response';
import { RequestBuilder } from './request-builder';

export interface Station {
  country_id: number;
  point_key: number;
}

@Injectable({
  providedIn: 'root',
})
export class RaspService {
  constructor(private http: HttpClient) {}

  rootUrl = 'https://suggests.rasp.yandex.net';
  rootUrlApi = 'https://api.rasp.yandex.net/v3.0';

  getCodeStation(
    format?: string,
    stationName?: string
  ): Observable<StrictHttpResponse<any>> {
    const rb = new RequestBuilder(this.rootUrl, '/all_suggests', 'get');
    if (format && stationName) {
      rb.query('format', format, {});
      rb.query('part', stationName, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => r as StrictHttpResponse<any>)
      );
  }

  getInfo(
    from?: number,
    to?: number,
    date?: string | null,
    transport_types?: string | null,
    apikey?: string
  ): Observable<StrictHttpResponse<any>> {
    const rb = new RequestBuilder(this.rootUrlApi, '/search', 'get');
    if (from && to && date && transport_types) {
      rb.query('from', from, {});
      rb.query('to', to, {});
      rb.query('date', date, {});
      rb.query('transport_types', transport_types, {});
      rb.query('apikey', apikey, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => r as StrictHttpResponse<any>)
      );
  }

  getInfoOthers(
    from?: number,
    to?: number,
    date?: string | null,
    apikey?: string
  ): Observable<StrictHttpResponse<any>> {
    const rb = new RequestBuilder(this.rootUrlApi, '/search', 'get');
    if (from && to && date) {
      rb.query('from', from, {});
      rb.query('to', to, {});
      rb.query('date', date, {});
      rb.query('apikey', apikey, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json',
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => r as StrictHttpResponse<any>)
      );
  }
}

// rb.header('Access-Control-Allow-Origin', '*');
// rb.header('Access-Control-Allow-Credentials', true);

// rb.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
// rb.header(
//   'Access-Control-Allow-Headers',
//   'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control'
// );
