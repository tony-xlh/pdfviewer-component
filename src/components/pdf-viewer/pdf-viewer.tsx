import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
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
    Dynamsoft.DWT.CreateDWTObjectEx({
        WebTwainId: 'dwtcontrol'
      },
      function(obj) {
        console.log("success");
        DWObject = obj;
        console.log(DWObject)
        if (this.width) {
          if (this.container) {
            this.container.style.width = this.width;
          }
          DWObject.Viewer.width = this.width;
        }
        if (this.height) {
          if (this.container) {
            this.container.style.height = this.height;
          }
          DWObject.Viewer.height = this.height;
        }
        if (this.webTWAINReady) {
          this.webTWAINReady.emit(DWObject);
        }
        DWObject.Viewer.bind(this.container);
        DWObject.Viewer.height = 600;
        DWObject.Viewer.width = 800;
        DWObject.Viewer.show();
      },
      function(err) {
        console.log(err);
      }
    );
    console.log("init end");
  }

  render() {
    return (
      <Host>
        <div id={this.containerID} ref={(el) => this.container = el as HTMLDivElement}></div>
        <slot></slot>
      </Host>
    );
  }

}
