import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  select,
  scaleTime,
  extent,
  event,
  drag,
  scaleLinear,
  line,
} from 'd3';
import { map, cloneDeep } from 'lodash';
import {
  map as mapf,
  flatten as flattenf,
  flow,
  find as findf,
  get as getf,
} from 'lodash/fp';
import { _3d } from 'd3-3d';

/* tslint:disable component-selector  */
@Component({
  selector: 'Line3d',
  template: `
      <svg #svg3d [attr.width]="width" [attr.height]="height">
        <svg:g #grid></svg:g>
        <svg:g #axis></svg:g>
        <svg:g #line></svg:g>
      </svg>
      <div class="projection">
        (X,Y)
        <svg #svgxy [attr.width]="width" [attr.height]="height">
        </svg>
        (Z,X)
        <svg #svgzx [attr.width]="width" [attr.height]="height">
        </svg>
        (Y,Z)
        <svg #svgyz [attr.width]="width" [attr.height]="height">
        </svg>
      </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
      }
      .projection {
        display: flex;
      }
      svg {
        margin: 18px 18px;
        margin-left: auto;
        margin-right: auto;
        border: 2px solid #eee;
      }
    `,
  ],
})
export class Line3dComponent implements OnInit, OnDestroy {
  @ViewChild( 'svg3d' ) elRef: ElementRef;
  @ViewChild( 'grid' ) gridElRef: ElementRef;
  @ViewChild( 'line' ) lineElRef: ElementRef;
  @ViewChild( 'axis' ) axisElRef: ElementRef;

  @ViewChild( 'svgxy' ) xyElRef: ElementRef;
  @ViewChild( 'svgzx' ) zxElRef: ElementRef;
  @ViewChild( 'svgyz' ) yzElRef: ElementRef;

  @Input() edge ? = 400;
  @Input() width ? = 400;
  @Input() height ? = 400;


  linexy = line().x(( d: any ) =>  this.tScale( d.X )).y(( d: any ) => this.yScale( d.Y ));
  linezx = line().y(( d: any ) => this.zScale( d.Z )).x(( d: any ) =>  this.tScale( d.X ));
  lineyz = line().x(( d: any ) => this.yScale( d.Y )).y(( d: any ) => this.zScale( d.Z ));

  scale = 1;
  origin = [ this.edge / 2, this.edge / 2 ];
  startAngle = Math.PI / 4;

  lineX = _3d()
    .origin( this.origin )
    .shape( 'LINE_STRIP' )
    .rotateZ( -this.startAngle )
    .rotateY( this.startAngle )
    .scale( this.scale );

  lineY = _3d()
    .origin( this.origin )
    .shape( 'LINE_STRIP' )
    .rotateZ( -this.startAngle )
    // .rotateX( this.startAngle )
    .scale( this.scale );

  lineZ = _3d()
    .origin( this.origin )
    .shape( 'LINE_STRIP' )
    // .rotateX( this.startAngle )
    .scale( this.scale );

  grid3d = _3d()
    .origin( this.origin )
    .shape( 'GRID', 20 )
    // .rotateY( this.startAngle )
    // .rotateX( -this.startAngle )
    // .rotateZ( -this.startAngle )
    .scale( this.scale );

  line3d = _3d()
    .origin( this.origin )
    .x( d => this.tScale( d.X ))
    .y( d => this.yScale( d.Y ))
    .z( d => this.zScale( d.Z ))
    .shape( 'LINE_STRIP' )
    // .rotateY( this.startAngle )
    // .rotateX( this.startAngle )
    .scale( this.scale );

  projectedDataset;
  tScale = scaleTime().range([ 0, this.edge / 2 ]);
  xScale = scaleLinear().range([ this.edge / 2, 0 ]);
  yScale = scaleLinear().range([ this.edge / 2, 0 ]);
  zScale = scaleLinear().range([ this.edge / 2, 0 ]);
  gScale = scaleLinear().range([ -this.edge / 2, 0 ]);
  updateSub: Subscription;
  data$ = new BehaviorSubject([]);

  constructor () {}

  ngOnInit (): void {
    this.updateSub = this.data$.subscribe( _ => {
      this.onInit();
    });
  }

  ngOnDestroy () {
    this.updateSub.unsubscribe();
  }

  onInit () {
    if ( !this.data ) {
      console.log( 'data is null' );
      return;
    }

    const data = flow(
      findf({ key: 'AM2' }),
      getf( 'values' ),
      mapf( 'values' )
    )( this.data );

    this.projectedDataset = this.projectData( cloneDeep ( data ));

    this.renderLine( this.projectedDataset.LINE );
    this.renderFace( this.projectedDataset.LINE, 'xy' );
    this.renderFace( this.projectedDataset.LINE, 'zx' );
    this.renderFace( this.projectedDataset.LINE, 'yz' );

    this.attachDrag();
  }

  renderGrid ( data ) {
    const grids: any = select( this.gridElRef.nativeElement )
      .attr( 'transform', 'translate(0, 100)' )
      .selectAll( '.grids' )
      .data( data );

    grids
      .enter()
      .append( 'path' )
      .merge( grids )
      .attr( 'class', 'grids' )
      .attr( 'd', this.grid3d.draw )
      .style( 'fill', '#ccc5' )
      .style( 'stroke', '#ccc3' )
      .style( 'stroke-opacity', 0.5 )
      .style( 'stroke-width', 1 );

    grids.exit().remove();

  }

  renderLine ( data ) {
    const lines: any = select( this.lineElRef.nativeElement )
      .selectAll( '.lines' )
      .data( data );

    lines
      .enter()
      .append( 'path' )
      .merge( lines )
      .attr( 'class', d => 'lines ink id--' )
      .attr( 'd', this.line3d.draw )
      .style( 'fill', 'none' )
      .style( 'stroke', '#777' )
      .style( 'stroke-opacity', 0.5 )
      .style( 'stroke-width', 1 );

    lines.exit().remove();
  }

  renderFace ( data, face ) {
    const lines: any = select( this[ face + 'ElRef'].nativeElement )
      .selectAll( '.lines' )
      .data( data );

    lines
      .enter()
      .append( 'path' )
      .merge( lines )
      .attr( 'class', d => 'lines ink id--' )
      .attr( 'd', this['line' + face])
      .style( 'fill', 'none' )
      .style( 'stroke', '#777' )
      .style( 'stroke-opacity', 0.5 )
      .style( 'stroke-width', 1 );

    lines.exit().remove();
  }

  renderAxis ( data, key, color ) {
    const axis: any = select( this.axisElRef.nativeElement )
      .selectAll( '.axis--' + key )
      .data( data );

    axis
      .enter()
      .append( 'path' )
      .merge( axis )
      .attr( 'class', `axis--${key}` )
      .attr( 'd', this['line' + key].draw )
      .style( 'fill', 'none' )
      .style( 'stroke', color )
      .style( 'stroke-opacity', 0.5 )
      .style( 'stroke-width', 2 );

    axis.exit().remove();
  }

  attachDrag () {
    select( this.elRef.nativeElement )
      .call(
        drag()
          .on( 'drag', dragged )
          .on( 'start', dragStart )
          .on( 'end', dragEnd )
      );

    let mx, my, mouseX, mouseY, beta, alpha;
    const self = this,
      startAngle = Math.PI / 4;

    function dragStart () {
      mx = event.x;
      my = event.y;
    }

    function dragged () {
      mouseX = mouseX || 0;
      mouseY = mouseY || 0;
      beta = (( event.x - mx + mouseX ) * Math.PI ) / 230;
      alpha = ((( event.y - my + mouseY ) * Math.PI ) / 230 ) * -1;
      const LINE = self.line3d
          .rotateY( beta + startAngle )
          .rotateX( alpha - startAngle ) (
            self.projectedDataset.LINE
          );
      self.renderLine( LINE );
    }

    function dragEnd () {
      mouseX = event.x - mx + mouseX;
      mouseY = event.y - my + mouseY;
    }
  }

  projectData ( data ) {
    const mapper = d => new Date( d.X );
    const ext = key => (
      flow(
        flattenf,
        mapf( key === 'X' ? mapper : key ),
        extent
      )( data )
    );

    const X: any = ext( 'X' );
    const Y = ext( 'Y' );
    const Z = ext( 'Z' );

    this.tScale.domain( X );
    this.xScale.domain([ 0, +new Date( X[1]) ]);
    let xtks: any = this.xScale.ticks( 5 );
    xtks = map( xtks, e => [ this.xScale( +new Date( e )), 0, 0 ]);

    this.yScale.domain([ 0, Y[1] ]);
    let ytks: any = this.yScale.ticks( 5 );
    ytks = map( ytks, e => [ 0, this.yScale( e ), 0 ]);

    this.zScale.domain([ 0, Z[1] ]);
    let ztks: any = this.zScale.ticks( 5 );
    ztks = map( ztks, e => [ 0, 0, this.zScale( e ) ]);

    // const j = 10, grids = [];
    // this.xScale.domain([ -10, 10 ]);
    // this.yScale.domain([ 10, -10 ]);
    // for ( let z = -j; z < j; z++ ) {
    //   for ( let x = -j; x < j; x++ ) {
    //     grids.push([ this.xScale( x ),  0,  this.yScale( z ) ]);
    //   }
    // }

    return {
      // GRID: this.grid3d( grids ),
      LINE: this.line3d( data ),
      Z: this.lineZ([ ztks ]),
      X: this.lineX([ xtks ]),
      Y: this.lineY([ ytks ]),
    };
  }

  updateScale ( data ) {
    const mapper = d => new Date( d.X );
    const xextent = flow(
        flattenf,
        mapf( mapper ),
        extent
      )( data );
    this.xScale.domain( xextent );
  }


  get data (): {}[] {
    return this.data$.getValue();
  }

  @Input()
  set data ( value ) {
    this.data$.next( value );
  }
}
