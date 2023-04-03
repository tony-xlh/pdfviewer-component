import { Component, h, Prop, getAssetPath, Event, EventEmitter, Host, Method } from '@stencil/core';
import Dynamsoft from "dwt";
import { WebTwain } from "dwt/dist/types/WebTwain";
import { ThumbnailViewer } from 'dwt/dist/types/WebTwain.Viewer';

@Component({
  tag: 'pdf-viewer',
  styleUrl: 'pdf-viewer.css',
  shadow: true,
  assetsDirs: ['assets']
})
export class PDFViewer {
  containerID:string = "dwtcontrolContainer";
  container:HTMLDivElement;
  toolbar:HTMLDivElement;
  thumbnailViewer:ThumbnailViewer;
  thumbnailShown:boolean = true;
  DWObject:WebTwain;
  @Prop() width?: string;
  @Prop() height?: string;
  @Prop() url?: string;
  @Event() webTWAINReady?: EventEmitter<WebTwain>;
  componentDidLoad() {
    console.log("load");
    this.initDWT();
  }

  initDWT() {
    Dynamsoft.DWT.ResourcesPath = "https://unpkg.com/dwt@18.0.0/dist";
    let pThis = this;
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
      Dynamsoft.DWT.CreateDWTObjectEx(
        {
          WebTwainId: 'dwtcontrol'
        },
        function(obj) {
          pThis.DWObject = obj;
          pThis.DWObject.Viewer.bind(pThis.container);
          pThis.DWObject.Viewer.show();
          if (pThis.width) {
            pThis.container.style.width = pThis.width;
            pThis.DWObject.Viewer.width = pThis.width;
          }
          if (pThis.height) {
            pThis.container.style.height = pThis.height;
            pThis.DWObject.Viewer.height = pThis.height;
          }
          if (pThis.webTWAINReady) {
            pThis.webTWAINReady.emit(pThis.DWObject);
          }
          pThis.DWObject.Viewer.cursor = "pointer";
          pThis.thumbnailViewer = pThis.DWObject.Viewer.createThumbnailViewer();
          pThis.thumbnailViewer.show();
          pThis.loadPDF();
        },
        function(err) {
          console.log(err);
        }
      );
    });
    Dynamsoft.DWT.Containers = [{
        WebTwainId: 'dwtObject'
    }];
    Dynamsoft.DWT.Load();
  }

  async loadPDF() {
    if (this.url) {
      let response = await fetch(this.url);
      let blob = await response.blob();
      console.log(blob);
      let pThis = this;
      this.DWObject.LoadImageFromBinary(blob,function(){
        pThis.DWObject.SelectImages([0]);
      },function(){});
    }
  }

  @Method()
  async toggleThumbnailViewer() {
    if (this.thumbnailShown) {
      this.thumbnailViewer.hide();
    }else{
      this.thumbnailViewer.show();
    }
    this.thumbnailShown = !this.thumbnailShown;
  }

  render() {
    const sideBar = getAssetPath(`./assets/sidebar.svg`);
    return (
      <Host>
        <div class="toolbar" ref={(el) => this.toolbar = el as HTMLDivElement}>
          <img class="Icon" src={sideBar} onClick={()=>this.toggleThumbnailViewer()}/>
        </div>
        <div id={this.containerID} ref={(el) => this.container = el as HTMLDivElement}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
