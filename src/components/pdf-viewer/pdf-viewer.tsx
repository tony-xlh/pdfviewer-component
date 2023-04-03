import { Component, h, Prop, Event, EventEmitter, Host } from '@stencil/core';
import Dynamsoft from "dwt";
import { WebTwain } from "dwt/dist/types/WebTwain";

@Component({
  tag: 'pdf-viewer',
  styleUrl: 'pdf-viewer.css',
  shadow: true,
})
export class PDFViewer {
  containerID:string = "dwtcontrolContainer";
  container:HTMLDivElement;
  @Prop() width?: string;
  @Prop() height?: string;
  @Event() webTWAINReady?: EventEmitter<WebTwain>;
  componentDidLoad(){
    console.log("load");
    this.initDWT();
  }

  initDWT(){
    Dynamsoft.DWT.ResourcesPath = "https://unpkg.com/dwt@18.0.0/dist";
    let DWObject = null;
    let pThis = this;
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
      Dynamsoft.DWT.CreateDWTObjectEx(
        {
          WebTwainId: 'dwtcontrol'
        },
        function(obj) {
          DWObject = obj;
          DWObject.Viewer.bind(pThis.container);
          DWObject.Viewer.show();
          if (pThis.width) {
            pThis.container.style.width = pThis.width;
            DWObject.Viewer.width = pThis.width;
          }
          if (pThis.height) {
            pThis.container.style.height = pThis.height;
            DWObject.Viewer.height = pThis.height;
          }
          if (pThis.webTWAINReady) {
            pThis.webTWAINReady.emit(DWObject);
          }
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

  render() {
    return (
      <Host>
        <div class="container" id={this.containerID} ref={(el) => this.container = el as HTMLDivElement}>
          <slot></slot>
        </div>
      </Host>
    );
  }

}
