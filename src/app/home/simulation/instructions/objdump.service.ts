import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjdumpService {
  public objdumpWorker = new Worker('./static/objdump.worker.js');

  constructor() { }


}
