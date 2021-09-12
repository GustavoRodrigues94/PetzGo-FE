import { Injectable } from '@angular/core';

//cdk
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs'
import { scan, map, mergeMap } from 'rxjs/operators'
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
    providedIn: 'root',
})
export class SpinnerService {

    private spinnerTopRef = this.cdkSpinnerCreate();

    private spin$ :Subject<boolean> = new Subject()

    constructor(private overlay: Overlay) {
      this.spin$
        .asObservable()
        .pipe(
          map(val => val ? 1 : -1 ),
          scan((acc, one) => (acc + one) >= 0 ? acc + one : 0, 0)
        )
        .subscribe(
          (res) => {
            if(res === 1){ this.exibirSpinner() }
            else if( res == 0 ){
              this.spinnerTopRef.hasAttached() ? this.pararSpinner(): null;
            }
          }
        )
    }

    private cdkSpinnerCreate() {
        return this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'dark-backdrop',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically()
        })
    }

    public exibirSpinner(){
      this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
    }

    public pararSpinner(){
      this.spinnerTopRef.detach() ;
    }
}
